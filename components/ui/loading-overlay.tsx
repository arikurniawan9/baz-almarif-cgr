// components/ui/loading-overlay.tsx
"use client";

import { Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message = "Mengautentikasi" }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-indigo-950/40 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative flex flex-col items-center"
          >
            {/* Animated Outer Ring */}
            <div className="absolute inset-0 h-24 w-24 -m-4 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent animate-spin duration-[2s]" />
            
            <div className="bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 animate-pulse" />
              
              <div className="relative">
                <Loader2 className="h-12 w-12 text-white animate-spin" />
                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-indigo-300 animate-bounce" />
              </div>
              
              <div className="text-center space-y-1 relative z-10">
                <h3 className="text-white font-black tracking-tight text-lg">{message}</h3>
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">
                  Secure Processing
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
