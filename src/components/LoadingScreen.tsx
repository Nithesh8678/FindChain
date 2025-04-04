import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [showLoading, setShowLoading] = useState(false);

  // Delay the appearance of the loading screen to avoid flashing for fast loads
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, 150);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {showLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-[#030502] z-[100] flex items-center justify-center"
        >
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{
              duration: 12,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* Outer Triangle (Illuminati Eye Frame) */}
            <motion.div
              className="w-40 h-40 relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <polygon
                  points="50,10 95,90 5,90"
                  stroke="url(#triangleGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Eye in the center */}
                <circle
                  cx="50"
                  cy="55"
                  r="15"
                  fill="url(#eyeGradient)"
                  stroke="#046A29"
                  strokeWidth="1"
                />

                {/* Pupil */}
                <motion.circle cx="50" cy="55" r="6" fill="#030502" />

                {/* Rays emanating from the eye */}
                {[...Array(12)].map((_, i) => (
                  <motion.line
                    key={i}
                    x1="50"
                    y1="55"
                    x2={50 + 40 * Math.cos((Math.PI * 2 * i) / 12)}
                    y2={55 + 40 * Math.sin((Math.PI * 2 * i) / 12)}
                    stroke="url(#rayGradient)"
                    strokeWidth="1"
                    strokeDasharray="1 2"
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      strokeDashoffset: [0, -20],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}

                {/* Gradient definitions */}
                <defs>
                  <linearGradient
                    id="triangleGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#03672A" />
                    <stop offset="50%" stopColor="#046A29" />
                    <stop offset="100%" stopColor="#03672A" />
                  </linearGradient>

                  <radialGradient
                    id="eyeGradient"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                  >
                    <stop offset="0%" stopColor="#03672A" stopOpacity="0.8" />
                    <stop offset="80%" stopColor="#046A29" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#03672A" />
                  </radialGradient>

                  <linearGradient
                    id="rayGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#03672A" stopOpacity="1" />
                    <stop offset="100%" stopColor="#046A29" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Rotating circle around the triangle */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 8,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full absolute"
                  fill="none"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#circleGradient)"
                    strokeWidth="0.5"
                    strokeDasharray="5,5"
                    fill="none"
                  />

                  <defs>
                    <linearGradient
                      id="circleGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#03672A" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#046A29" />
                      <stop
                        offset="100%"
                        stopColor="#03672A"
                        stopOpacity="0.4"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Loading text */}
          <motion.div
            className="absolute bottom-20"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <h2 className="font-nasalization text-xl text-[#03672A] tracking-widest">
              LOADING
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ...
              </motion.span>
            </h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
