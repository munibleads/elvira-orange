"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getVapi } from "@/lib/vapi";

interface WasteAssistantProps {
  onInteractionAction: () => void;
}

export default function WasteAssistant({ onInteractionAction }: WasteAssistantProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const vapiRef = useRef<ReturnType<typeof getVapi> | null>(null);

  // init vapi on mount
  useEffect(() => {
    try {
      vapiRef.current = getVapi();
      
      // Set up event listeners for Vapi
      if (vapiRef.current) {
        vapiRef.current.on('call-start', () => {
          console.log('Vapi call started');
          setIsPlaying(true);
          setIsListening(true);
        });

        vapiRef.current.on('call-end', () => {
          console.log('Vapi call ended');
          setIsPlaying(false);
          setIsListening(false);
        });

        vapiRef.current.on('speech-start', () => {
          console.log('Vapi speech started');
        });

        vapiRef.current.on('speech-end', () => {
          console.log('Vapi speech ended');
        });

        vapiRef.current.on('error', (error) => {
          console.error('Vapi error:', error);
          setIsPlaying(false);
          setIsListening(false);
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

  // Auto-idle after 30 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => setIsIdle(true), 30000);
    return () => clearTimeout(timer);
  }, [isPlaying, isListening]);

  const handleLocalInteraction = () => {
    setIsIdle(false);
    onInteractionAction();
  };

  const toggleAssistant = async () => {
    handleLocalInteraction();
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!vapiRef.current) return;

    if (!isPlaying) {
      if (!assistantId) {
        console.error("Missing NEXT_PUBLIC_VAPI_ASSISTANT_ID env var");
        return;
      }
      try {
        await vapiRef.current.start(assistantId);
        setIsPlaying(true);
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start Vapi call", err);
      }
    } else {
      try {
        await vapiRef.current.stop();
      } catch (err) {
        console.error("Failed to stop Vapi call", err);
      } finally {
        setIsPlaying(false);
        setIsListening(false);
      }
    }
  };

  const handleCategoryClick = () => {
    handleLocalInteraction();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-black/[0.04] shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.25)]">
      {/* Header */}
      <div className="px-8 pt-10 pb-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <Image 
              src="/Elvira Long transparent.png" 
              alt="Elvira Logo" 
              width={120} 
              height={37}
              className="object-contain"
            />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-black text-[34px] leading-[40px] font-light tracking-[-0.02em]">
            AI Waste Classification
          </h1>
          <p className="text-[#6B7280] text-sm font-normal">Talk to our AI Voice Agent</p>
        </div>
      </div>

      {/* Apple-styled voice interaction */}
      <div className="px-8 pb-8 flex flex-col items-center flex-1">
        <div className="mb-10 pt-6">
          <button 
            className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 active:scale-[0.98] transition-transform duration-200 shadow-[0_10px_30px_rgba(16,185,129,0.35)] relative group" 
            onClick={toggleAssistant}
          >
            {/* Apple-style pulse effect */}
            {isPlaying && (
              <>
                <div className="absolute inset-0 rounded-full border border-emerald-500 animate-ping opacity-60" />
                <div className="absolute inset-2 rounded-full border border-emerald-500 animate-ping opacity-40" style={{ animationDelay: '0.5s' }} />
              </>
            )}
            
            {/* Microphone icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" fill="currentColor"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Apple-styled status indicators */}
        {isListening && (
          <div className="bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-4 mb-6 w-full">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-emerald-700 text-sm font-light">AI Voice Active...</p>
            </div>
          </div>
        )}

        {isPlaying && !isListening && (
          <div className="bg-blue-500/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 mb-6 w-full">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <p className="text-blue-700 text-sm font-light">AI Speaking...</p>
            </div>
          </div>
        )}

        {isIdle && (
          <div className="bg-white/50 backdrop-blur-sm border border-black/10 rounded-2xl p-4 mb-6 w-full">
            <p className="text-[#6B7280] text-sm text-center font-light">
              Tap anywhere to wake up
            </p>
          </div>
        )}

        {/* Apple-styled category section (Updated to Flexbox) */}
        <div className="flex w-full gap-2">
          <button 
            className="flex-1 group p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-black/10 hover:border-emerald-500 hover:bg-emerald-50/60 active:scale-[0.985] transition-all duration-200 text-center shadow-sm hover:shadow-md"
            onClick={handleCategoryClick}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-all duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 8v6m11-7h-6m-8 0H1m15.5-6.5l-4.24 4.24M7.76 16.24l-4.24 4.24m12.48 0l-4.24-4.24M7.76 7.76L3.52 3.52"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-black">Recyclable</div>
                <div className="text-xs text-[#6B7280] font-light">Bottles, cans</div>
              </div>
            </div>
          </button>
          
          <button 
            className="flex-1 group p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-black/10 hover:border-emerald-500 hover:bg-emerald-50/60 active:scale-[0.985] transition-all duration-200 text-center shadow-sm hover:shadow-md"
            onClick={handleCategoryClick}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-all duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.33L10.5 11L5.33 5.83L3.83 7.33L7.5 11L5.83 12.67L4.33 11.17L2.83 12.67L9 18.83L15 12.83V15C15 16.1 15.9 17 17 17C18.1 17 19 16.1 19 15V9H21Z"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-black">Compost</div>
                <div className="text-xs text-[#6B7280] font-light">Food, organic</div>
              </div>
            </div>
          </button>
          
          <button 
            className="flex-1 group p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/10 hover:border-gray-400 hover:bg-gray-50 active:scale-[0.985] transition-all duration-200 text-center shadow-sm hover:shadow-md"
            onClick={handleCategoryClick}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-200 transition-all duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 3V4H4V6H5V19A2 2 0 0 0 7 21H17A2 2 0 0 0 19 19V6H20V4H15V3H9M7 6H17V19H7V6M9 8V17H11V8H9M13 8V17H15V8H13Z"/>
                </svg>
              </div>
              <div>
                <div className="text-base font-medium text-black mb-1">General</div>
                <div className="text-sm text-[#6B7280] font-light">Non-recyclable items</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}