import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import Confetti from "react-confetti";

interface WelcomeProps {
  userName: string;
  uniqueId: string;
}

const Welcome: React.FC<WelcomeProps> = ({ userName, uniqueId }) => {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti] = useState(true);
  const [countdown, setCountdown] = useState(5);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/dashboard");
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030502] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#03672A]/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-[#046A29]/20 to-transparent"></div>

        {/* Animated circles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#03672A]/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#046A29]/10"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      {/* Welcome content */}
      <motion.div
        className="relative z-10 w-full max-w-md p-8 bg-[#030502]/80 backdrop-blur-lg rounded-xl border border-[#03672A]/30 shadow-2xl text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="mx-auto w-20 h-20 bg-[#03672A]/20 rounded-full flex items-center justify-center mb-6"
        >
          <FiCheckCircle className="text-[#03672A] text-4xl" />
        </motion.div>

        <motion.h1
          className="text-4xl font-nasalization text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Welcome to FindChain!
        </motion.h1>

        <motion.p
          className="text-white font-montserrat text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Hello, <span className="text-[#03672A] font-bold">{userName}</span>!
        </motion.p>

        <motion.div
          className="bg-[#03672A]/20 border border-[#03672A]/30 rounded-lg p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-[#03672A] font-montserrat mb-2">Your Unique ID</p>
          <p className="text-white font-nasalization text-2xl">{uniqueId}</p>
        </motion.div>

        <motion.p
          className="text-white/70 font-montserrat text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Redirecting to dashboard in {countdown} seconds...
        </motion.p>

        <motion.button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center px-6 py-3 bg-[#03672A] hover:bg-[#046A29] text-white font-montserrat rounded-lg transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Go to Dashboard <FiArrowRight className="ml-2" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Welcome;
