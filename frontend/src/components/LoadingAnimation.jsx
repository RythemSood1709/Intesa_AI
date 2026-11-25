import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const LoadingAnimation = () => {
  const ThinkingLabels = [
    "Thinking",
    "Analyzing",
    "Reasoning",
    "Generating Response",
  ];

  const [labelIndex, setLabelIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLabelIndex((prevIndex) => (prevIndex + 1) % ThinkingLabels.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const label = ThinkingLabels[labelIndex];

  return (
    <div className="flex items-center gap-3 max-w-[72%] py-1">
      <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
        {[0, 0.45, 0.9].map((delay, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 rounded-full border border-cyan-400/30"
            initial={{ scale: 0.3, opacity: 0.55 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.span
          className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan-300 to-rose-400/80"
          style={{ boxShadow: "0 0 14px rgba(125, 211, 252, 0.55)" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="flex overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={label}
            className="flex"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {label.split("").map((char, index) => (
              <motion.div
                key={index}
                className="text-[13px] font-medium tracking-wide text-slate-300"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.07,
                }}
              >
                {char}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoadingAnimation;
