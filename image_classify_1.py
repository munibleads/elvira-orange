import os
import json
import cv2
import base64
import time
import serial

from datetime import datetime, timezone
from typing import Tuple, Optional, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed

import google.generativeai as genai
from supabase import create_client, Client
import pyttsx4


# -------------------------------
# Configuration
# -------------------------------
# Prefer environment variables; fall back to known values from the project for convenience
SUPABASE_URL = os.getenv(
    "SUPABASE_URL",
    "https://fiqzsiwurgzctxtkzueo.supabase.co",
)
SUPABASE_ANON_KEY = os.getenv(
    "SUPABASE_ANON_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcXpzaXd1cmd6Y3R4dGt6dWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTE5MzIsImV4cCI6MjA3MDQ4NzkzMn0.3TM5wz6yXvpSMT_zaTZiskG8tWtSpK_UV57Pinr7AfY",
)
BUCKET_NAME = os.getenv("SUPABASE_BUCKET", "waste-images")

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY",
    "AIzaSyCeXeLnCRZ5W1tTCzKniMbKpGoafD-xjmQ",
)
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")

# Arduino serial configuration
ARDUINO_PORT = "/dev/serial0"  # Use same port as working loopback test
ARDUINO_BAUDRATE = 9600  # Use same baud rate as working loopback test




# -------------------------------
# Clients
# -------------------------------
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)

# Arduino serial connection
arduino_serial: Optional[serial.Serial] = None

# TTS will be initialized per call to avoid issues


# -------------------------------
# Helpers
# -------------------------------
def speak_classification(category: str, item_class: str):
    """Convert classification to speech using text-to-speech."""
    try:
        # Create the speech messagecamera
        message = f"Great! I see you have placed a {item_class}. This item is {category}."
        print(f"Speaking: {message}")
        
        # Initialize TTS engine fresh each time to avoid issues
        tts_engine = pyttsx4.init()
        tts_engine.setProperty('rate', 230)  # Speed of speech (increased from 150)
        tts_engine.setProperty('volume', 0.8)  # Volume level (0.0 to 1.0)
        
        # Use TTS to speak the message
        tts_engine.say(message)
        tts_engine.runAndWait()
        
        # Clean up the engine
        tts_engine.stop()
        del tts_engine
        
    except Exception as e:
        print(f"Error with text-to-speech: {e}")



def find_arduino_port():
    """Return the hardcoded serial port that works with Raspberry Pi"""
    return "/dev/serial0"


def ensure_bucket_exists(bucket_name: str) -> bool:
    try:
        buckets = supabase.storage.list_buckets()
        if any(b.name == bucket_name for b in buckets):
            return True
        # Access directly as a fallback check
        supabase.storage.from_(bucket_name).list()
        return True
    except Exception:
        return False


def generate_storage_path() -> str:
    now = datetime.now(timezone.utc)
    return f"{now:%Y/%m/waste_image_%Y%m%d_%H%M%S_%fZ}.jpg"


def encode_frame_to_jpeg_bytes(frame) -> bytes:
    success, buffer = cv2.imencode(".jpg", frame)
    if not success:
        raise RuntimeError("Failed to encode frame to JPEG")
    return buffer.tobytes()


def encode_frame_to_jpeg_bytes_optimized(frame, quality=70, max_width=800) -> bytes:
    """Optimize image for faster transmission by resizing and reducing quality"""
    height, width = frame.shape[:2]
    
    # Resize if image is too large
    if width > max_width:
        scale = max_width / width
        new_width = int(width * scale)
        new_height = int(height * scale)
        frame = cv2.resize(frame, (new_width, new_height), interpolation=cv2.INTER_AREA)
    
    # Encode with lower quality for faster transmission
    encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
    success, buffer = cv2.imencode(".jpg", frame, encode_params)
    if not success:
        raise RuntimeError("Failed to encode frame to JPEG")
    
    return buffer.tobytes()


def get_public_url_safe(bucket: str, path: str) -> str:
    resp = supabase.storage.from_(bucket).get_public_url(path)
    if isinstance(resp, dict):
        # SDK may return either top-level or nested
        return (
            resp.get("data", {}).get("publicUrl")
            or resp.get("publicUrl")
            or str(resp)
        )
    return str(resp)


def upload_image_bytes(image_bytes: bytes) -> Tuple[str, str]:
    storage_path = generate_storage_path()
    supabase.storage.from_(BUCKET_NAME).upload(
        path=storage_path,
        file=image_bytes,
        file_options={"content-type": "image/jpeg"},
    )
    public_url = get_public_url_safe(BUCKET_NAME, storage_path)
    return storage_path, public_url


def build_prompt() -> str:
    return (
        "You are a strict waste sorting classifier. Return ONLY valid JSON with keys "
        '"category", "class".\n'
        "- category must be exactly one of: recyclable, non-recyclable, organic.\n"
        "- class must be the identified object (e.g., 'plastic bottle', 'banana peel').\n"
        "No code fences, no extra text."
    )


def call_gemini_with_image(image_bytes: bytes, public_url: Optional[str]) -> str:
    # Primary: inline base64; URL is included in the text for additional context
    encoded_image = base64.b64encode(image_bytes).decode("utf-8")
    image_part = {"mime_type": "image/jpeg", "data": encoded_image}

    prompt_lines = [build_prompt()]
    if public_url:
        prompt_lines.append(f"Image URL (for reference): {public_url}")

    prompt_part = {"text": "\n".join(prompt_lines)}
    response = model.generate_content([prompt_part, image_part], request_options={"timeout": 45})
    return response.text


def extract_json_object(text: str) -> Dict[str, str]:
    # Try direct JSON first
    try:
        return json.loads(text)
    except Exception:
        pass

    # Strip code fences if present
    if "```" in text:
        stripped = text
        # Remove surrounding code fences
        stripped = stripped.replace("```json", "```")
        parts = stripped.split("```")
        for part in parts:
            part = part.strip()
            if not part:
                continue
            try:
                return json.loads(part)
            except Exception:
                continue

    # Fallback: naive braces extraction
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = text[start : end + 1]
        try:
            return json.loads(candidate)
        except Exception:
            pass

    raise ValueError("Could not parse JSON from model response")


def normalize_category(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    v = value.strip().lower()
    if v in {"recyclable", "recycle", "recyclables"}:
        return "recyclable"
    if v in {"non-recyclable", "non recyclable", "nonrecyclable", "trash", "landfill"}:
        return "non-recyclable"
    if v in {"organic", "compost", "organic waste"}:
        return "organic"
    return v


def get_classification_code(category: Optional[str]) -> Optional[int]:
    """Maps a normalized waste category to a numerical code."""
    if category == "recyclable":
        return 1
    elif category == "non-recyclable":
        return 2
    elif category == "organic":
        return 3
    return None


def send_to_arduino(code: int) -> bool:
    """Send classification code to Arduino via serial communication."""
    global arduino_serial
    if arduino_serial and arduino_serial.is_open:
        try:
            # Send the code as a single byte (0-255 range)
            arduino_serial.write(bytes([code]))
            arduino_serial.flush()  # Ensure data is sent immediately
            print(f"Sent code {code} to Arduino")
            return True
        except Exception as e:
            print(f"Failed to send to Arduino: {e}")
            return False
    else:
        print("Arduino serial connection not available")
        return False


def insert_record(
    image_url: str,
    gemini_raw: str,
    user_prompt: str,
    parsed: Dict[str, Optional[str]],
    raw_image_b64: Optional[str] = None,
):
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "image_url": image_url,
        "gemini_response": gemini_raw,
        "user_prompt": user_prompt,
        # optional, but kept for debugging/traceability
        "raw_image_data": raw_image_b64,
        # new structured fields
        "category": normalize_category(parsed.get("category")),
        "class": parsed.get("class"),
    }
    supabase.table("waste_classifications").insert(payload).execute()


def process_image_parallel(image_bytes: bytes) -> Tuple[str, str, str]:
    """Process image upload and Gemini call in parallel"""
    with ThreadPoolExecutor(max_workers=2) as executor:
        # Submit both tasks simultaneously
        upload_future = executor.submit(upload_image_bytes, image_bytes)
        gemini_future = executor.submit(call_gemini_with_image, image_bytes, None)
        
        # Wait for both to complete
        storage_path, public_url = upload_future.result()
        response_text = gemini_future.result()
        
        return storage_path, public_url, response_text


def capture_loop():
    global arduino_serial
    
    # Removed serial connection initialization from here.
    # It is now handled in the main() function.
    # VideoCapture(0) is camera 1, and VideoCapture(1) is camera 2, where camera 2 is the one we want to use for image classification.

    cap = cv2.VideoCapture(1)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    print("Press 'c' to capture, 'x' to exit.")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error: Could not read frame.")
                break

            cv2.imshow("Elvira MVP - Camera", frame)
            key = cv2.waitKey(1) & 0xFF

            if key == ord("c"):
                try:
                    # Start timing
                    start_time = time.time()
                    
                    image_bytes = encode_frame_to_jpeg_bytes_optimized(frame)

                    # Process upload and Gemini call in parallel
                    storage_path, public_url, response_text = process_image_parallel(image_bytes)

                    # Get prompt text for database storage
                    prompt_text = build_prompt()

                    # End timing
                    end_time = time.time()
                    elapsed_time = end_time - start_time

                    # Parse JSON
                    parsed = extract_json_object(response_text)
                    if 'description' in parsed:
                        del parsed['description']
                    # Normalize category once for all downstream uses
                    parsed['category'] = normalize_category(parsed.get('category'))
                    
                    # Speak the classification result
                    category = parsed.get('category')
                    item_class = parsed.get('class')
                    if category and item_class:
                        speak_classification(category, item_class)

                    # Encode image for optional DB storage
                    raw_b64 = base64.b64encode(image_bytes).decode("utf-8")

                    # Insert record
                    insert_record(
                        image_url=public_url,
                        gemini_raw=response_text,
                        user_prompt=prompt_text,
                        parsed=parsed,
                        raw_image_b64=raw_b64,
                    )

                    # Send classification code to Arduino
                    classification_code = get_classification_code(parsed.get('category'))
                    if classification_code:
                        send_to_arduino(classification_code)

                    print("Saved classification to Supabase.")
                    print(f"URL: {public_url}")
                    print(f"Parsed: {parsed}")
                    print(f"Classification: {parsed.get('category').title() if parsed.get('category') else 'N/A'}")
                    print(f"Code: {classification_code if classification_code else 'N/A'}")
                    print(f"Total time: {elapsed_time:.2f} seconds")

                except Exception as e:
                    print(f"Failure during capture/classify/save: {e}")

            elif key == ord("x"):
                break

    finally:
        # Clean up
        if arduino_serial and arduino_serial.is_open:
            arduino_serial.close()
            print("Arduino serial connection closed")
        cap.release()
        cv2.destroyAllWindows()


def main():
    global arduino_serial

    if not ensure_bucket_exists(BUCKET_NAME):
        print(f"Bucket '{BUCKET_NAME}' not found or accessible.")
        return

    # Initialize Arduino serial connection
    try:
        # Use the same approach as the working loopback test
        arduino_serial = serial.Serial(
            port=ARDUINO_PORT,
            baudrate=ARDUINO_BAUDRATE,
            timeout=1
        )
        print(f"Arduino connected on {ARDUINO_PORT} at {ARDUINO_BAUDRATE} baud")
        # Send confirmation message to Arduino
        try:
            arduino_serial.write(b"Hey, found you finally\n")
            arduino_serial.flush()
            print("Sent 'Hey, found you finally' to Arduino")
        except Exception as write_e:
            print(f"Failed to send initial message to Arduino: {write_e}")
    except Exception as e:
        print(f"Failed to connect to Arduino: {e}")
        print("Continuing without Arduino connection...")
        arduino_serial = None

    capture_loop()


if __name__ == "__main__":
    main()