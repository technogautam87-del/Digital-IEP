import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Delete, Shield, AlertCircle, X } from "lucide-react";

interface PinLockOverlayProps {
  onUnlock: () => void;
  onClose: () => void;
  correctPin?: string;
}

export default function PinLockOverlay({ onUnlock, onClose, correctPin = "2026" }: PinLockOverlayProps) {
  const [pin, setPin] = useState<string>("");
  const [errorCount, setErrorCount] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>(false);

  const handleKeyPress = (value: string) => {
    if (pin.length < 4) {
      const nextPin = pin + value;
      setPin(nextPin);
      setShowError(false);
      
      if (nextPin === correctPin) {
        // Success transition
        setTimeout(() => {
          onUnlock();
          setPin("");
        }, 150);
      } else if (nextPin.length === 4) {
        // Incorrect Pin entered
        setTimeout(() => {
          setShowError(true);
          setErrorCount((prev) => prev + 1);
          setPin("");
        }, 200);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setShowError(false);
  };

  const handleClear = () => {
    setPin("");
    setShowError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-white border-2 border-slate-250 rounded-2xl p-8 flex flex-col items-center shadow-2xl relative"
      >
        {/* Close Button to return back */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-all cursor-pointer"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 mb-4 shadow">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-black text-slate-900 tracking-wide mb-1 font-sans">
          Administrative Terminal
        </h2>
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 text-center mb-6 max-w-[240px]">
          Enter PIN to authorize system configuration edits
        </p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-4">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < pin.length;
            return (
              <motion.div
                key={index}
                animate={isFilled ? { scale: [1, 1.25, 1], backgroundColor: "#4f46e5" } : { scale: 1 }}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isFilled 
                    ? "bg-indigo-600 border-indigo-600 shadow" 
                    : "border-slate-300 bg-transparent"
                }`}
              />
            );
          })}
        </div>

        {/* Dynamic Status / Error Msg */}
        <div className="h-6 mb-6 flex items-center">
          <AnimatePresence mode="wait">
            {showError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-rose-600 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider"
              >
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Incorrect Code. Try again...
              </motion.p>
            )}
            {!showError && pin.length === 0 && errorCount > 0 && (
              <span className="text-slate-400 text-[10px] tracking-widest font-bold uppercase">
                Attempt {errorCount} Failed
              </span>
            )}
          </AnimatePresence>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-6 w-full max-w-[240px]">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-14 h-14 rounded-full border-2 border-slate-200 bg-slate-50 text-slate-800 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white hover:shadow-md active:scale-90 transition-all text-xl font-bold font-sans flex items-center justify-center cursor-pointer"
            >
              {num}
            </button>
          ))}
          
          <button
            onClick={handleClear}
            className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-indigo-600 font-extrabold transition-all text-center flex items-center justify-center cursor-pointer"
          >
            Clear
          </button>

          <button
            onClick={() => handleKeyPress("0")}
            className="w-14 h-14 rounded-full border-2 border-slate-200 bg-slate-50 text-slate-800 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white hover:shadow-md active:scale-90 transition-all text-xl font-bold font-sans flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          <button
            onClick={handleBackspace}
            aria-label="backspace"
            className="text-slate-400 hover:text-indigo-600 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-8 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-100 p-2 px-3 rounded-xl border border-slate-200">
          <Shield className="w-3.5 h-3.5 text-indigo-500" />
          <span>Secure Admin Terminal</span>
        </div>
      </motion.div>
    </div>
  );
}
