"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { USERS } from "@/lib/constants";

interface Props {
  onLogin: (code: string) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleDigit(d: string) {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError(false);

    if (next.length === 4) {
      setTimeout(() => {
        if (USERS[next]) {
          onLogin(next);
        } else {
          setShaking(true);
          setError(true);
          setTimeout(() => {
            setPin("");
            setShaking(false);
          }, 650);
        }
      }, 80);
    }
  }

  function handleDelete() {
    setPin((p) => p.slice(0, -1));
    setError(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600 rounded-full filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xs"
      >
        {/* Card */}
        <div className="bg-white/8 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 14 }}
              className="text-6xl mb-4 select-none"
            >
              🏠
            </motion.div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
              ממן מטלות
            </h1>
            <p className="text-white/50 text-sm">ניהול מטלות בית משפחתיות</p>
          </div>

          {/* PIN dots */}
          <motion.div
            animate={shaking ? { x: [-8, 8, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center gap-4 mb-8"
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: i === pin.length - 1 ? [1.4, 1] : 1,
                  backgroundColor:
                    error
                      ? "rgba(239,68,68,0.9)"
                      : i < pin.length
                      ? "rgba(167,139,250,1)"
                      : "rgba(255,255,255,0.15)",
                  boxShadow:
                    i < pin.length && !error
                      ? "0 0 12px rgba(167,139,250,0.7)"
                      : "none",
                }}
                transition={{ duration: 0.15 }}
                className="w-4 h-4 rounded-full"
              />
            ))}
          </motion.div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-2.5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
              <PadButton key={d} label={d} onClick={() => handleDigit(d)} />
            ))}
            <div /> {/* spacer */}
            <PadButton label="0" onClick={() => handleDigit("0")} />
            <PadButton label="⌫" onClick={handleDelete} subtle />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-red-400 text-sm mt-4 font-medium"
              >
                קוד לא מוכר — נסה שנית
              </motion.p>
            )}
          </AnimatePresence>

          <p className="text-center text-white/30 text-xs mt-5 leading-relaxed">
            הכנס 4 ספרות אחרונות
            <br />
            של מספר הטלפון שלך
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function PadButton({
  label,
  onClick,
  subtle,
}: {
  label: string;
  onClick: () => void;
  subtle?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.18)" }}
      onClick={onClick}
      className={`
        rounded-2xl py-4 text-xl font-semibold transition-colors border border-white/8 select-none
        ${subtle ? "text-white/50 bg-white/5" : "text-white bg-white/10"}
      `}
    >
      {label}
    </motion.button>
  );
}
