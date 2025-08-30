import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { getVapi } from "@/lib/vapi";


interface CardOneProps {
  onClick?: () => void;
  isExpanded?: boolean;
  onClose?: () => void;
}

export default function CardOne({ onClick, isExpanded = false, onClose }: CardOneProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const vapiRef = useRef<ReturnType<typeof getVapi> | null>(null);
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

  useEffect(() => {
    try {
      vapiRef.current = getVapi();
      
      if (vapiRef.current) {
        vapiRef.current.on('call-start', () => {
          console.log('Vapi call started from CardOne');
          setIsPlaying(true);
        });

        vapiRef.current.on('call-end', () => {
          console.log('Vapi call ended from CardOne');
          setIsPlaying(false);
        });

        vapiRef.current.on('error', (error) => {
          console.error('Vapi error in CardOne:', error);
          setIsPlaying(false);
        });
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      try {
        vapiRef.current?.stop?.();
      } catch {
        /* noop */
      }
    };
  }, []);





  useEffect(() => {
    if (!isExpanded && isPlaying) {
      // If card collapses and Vapi is playing, stop Vapi
      vapiRef.current?.stop?.();
    }
  }, [isExpanded, isPlaying]);

  const handleClick = async () => {
    if (!isExpanded && onClick) {
      onClick(); // Expand the card
      
      if (!vapiRef.current) return;

      if (!isPlaying) {
        if (!assistantId) {
          console.error("Missing NEXT_PUBLIC_VAPI_ASSISTANT_ID env var");
          return;
        }
        try {
          await vapiRef.current.start(assistantId);
        } catch (err) {
          console.error("Failed to start Vapi call from CardOne", err);
        }
      }
    }
  };

  const handleClose = async () => {
    if (isPlaying) {
      try {
        await vapiRef.current?.stop?.();
      } catch (err) {
        console.error("Failed to stop Vapi call from CardOne on close", err);
      }
    }
    if (onClose) {
      onClose();
    }
  };

  const cardClasses = isExpanded 
    ? "w-full h-full flex flex-col justify-center cursor-default" 
    : "w-full flex flex-col h-full justify-center cursor-pointer";

  const iconSize = isExpanded ? 128 : 64;
  const mouthSize = isExpanded ? 240 : iconSize;

  return (
    <Card 
      className={cardClasses}
      style={{ backgroundColor: '#FF8D30' }}
      onClick={handleClick}
    >
      <CardHeader className="flex justify-center items-center pb-0 pt-0">
        {isExpanded && (
          <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 text-white text-xl font-bold z-10"
          >
            &times;
          </button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 pt-0 h-full w-full relative">
        {isExpanded ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="eyes">
              <div className="eye left"></div>
              <div className="eye right"></div>
            </div>
            <div className="mouth">
              <svg width={mouthSize * 3} height={mouthSize} viewBox="0 0 24 24" fill="none" className="text-white">
                <rect x="0" y="10" width="2" height="4" fill="currentColor" rx="1">
                  <animate attributeName="height" values="4;8;4;6;4" dur="3s" repeatCount="indefinite" begin="5s"/>
                  <animate attributeName="y" values="10;8;10;9;10" dur="3s" repeatCount="indefinite" begin="5s"/>
                </rect>
                <rect x="4" y="8" width="2" height="8" fill="currentColor" rx="1">
                  <animate attributeName="height" values="8;4;12;6;8" dur="1s" repeatCount="indefinite" begin="5s"/>
                  <animate attributeName="y" values="8;10;6;9;8" dur="1s" repeatCount="indefinite" begin="5s"/>
                </rect>
                <rect x="8" y="4" width="2" height="16" fill="currentColor" rx="1">
                  <animate attributeName="height" values="16;12;16;8;16" dur="0.8s" repeatCount="indefinite" begin="5s"/>
                  <animate attributeName="y" values="4;6;4;8;4" dur="0.8s" repeatCount="indefinite" begin="5s"/>
                </rect>
                <rect x="12" y="2" width="2" height="20" fill="currentColor" rx="1">
                  <animate attributeName="height" values="20;16;20;12;20" dur="0.7s" repeatCount="indefinite" begin="5s"/>
                  <animate attributeName="y" values="2;4;2;6;2" dur="0.7s" repeatCount="indefinite" begin="5s"/>
                </rect>
                <rect x="16" y="4" width="2" height="16" fill="currentColor" rx="1">
                  <animate attributeName="height" values="16;12;16;8;16" dur="0.9s" repeatCount="indefinite" begin="5s"/>
                  <animate attributeName="y" values="4;6;4;8;4" dur="0.9s" repeatCount="indefinite" begin="5s"/>
                </rect>
                <rect x="20" y="6" width="2" height="12" fill="currentColor" rx="1">
                  <animate attributeName="height" values="12;6;14;10;12" dur="1.1s" repeatCount="indefinite" begin="5s"/>
                  <animate attributeName="y" values="6;9;5;7;6" dur="1.1s" repeatCount="indefinite" begin="5s"/>
                </rect>
                <rect x="24" y="9" width="2" height="6" fill="currentColor" rx="1">
                  <animate attributeName="height" values="6;10;4;8;6" dur="1.3s" repeatCount="indefinite" begin="5s"/>
                  <animate attributeName="y" values="9;7;10;8;9" dur="1.3s" repeatCount="indefinite" begin="5s"/>
                </rect>
              </svg>
            </div>
            <style jsx>{`
              .eyes{
                position:absolute;
                top:50%;
                left:50%;
                transform: translate3d(-50%,calc(-50% - 100px),0);
                width:450px;
                display:flex;
                justify-content:space-between;
              }
              .eye{
                position:relative;
                width:200px;
                height:260px;
                background:#fff;
                border-radius:50%;
                animation:eye 7.5s infinite;
              }
              .eye::after{
                content:"";
                position:absolute;
                top:50%;
                width:65%;
                height:65%;
                background:#000;
                border-radius:50%;
                transform:translate3d(-50%,-50%,0);
                animation: eyes 3.5s infinite;
              }
              .eye.left::after{ left:60%; }
              .eye.right::after{ left:40%; }
              @keyframes eye{
                0%,5%,30%,37%,100%{ height:260px; transform:translate3d(0,0,0); }
                3%,33%{ height:0; transform: translate3d(0,-50%,0); }
              }
              @keyframes eyes{
                0%,20%{ top:60%; }
                21%,40%,81%,100%{ top:50%; }
              }
              .mouth{
                position:absolute;
                top:50%;
                left:50%;
                transform: translate3d(-50%,40%,0);
              }
            `}</style>
          </div>
        ) : (
          <div className="mb-0 bg-white/20 rounded-full p-6">
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" fill="currentColor"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
