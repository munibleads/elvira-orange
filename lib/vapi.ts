"use client";

import Vapi from "@vapi-ai/web";

let cachedVapi: InstanceType<typeof Vapi> | null = null;

export function getVapi(): InstanceType<typeof Vapi> {
  if (typeof window === "undefined") {
    throw new Error("Vapi can only be initialized in the browser");
  }

  if (!cachedVapi) {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error("Missing NEXT_PUBLIC_VAPI_PUBLIC_KEY env var");
    }
    cachedVapi = new Vapi(publicKey);
  }
  return cachedVapi as InstanceType<typeof Vapi>;
}

