import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "react-spring";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiMail,
  FiLock,
  FiUser,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Confetti from "react-confetti";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    loading,
    error,
    isNewUser,
    uniqueId,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    clearError,
  } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      if (isNewUser) {
        setShowConfetti(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, loading, isNewUser, navigate]);

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

  // Spring animation for the form
  const formSpring = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 300, friction: 20 },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      await signInWithEmail(formData.email, formData.password);
    } else {
      await registerWithEmail(formData.name, formData.email, formData.password);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    clearError();
  };

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

      {/* Confetti for new users */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      {/* Auth form */}
      <animated.div
        style={formSpring}
        className="relative z-10 w-full max-w-md p-8 bg-[#030502]/80 backdrop-blur-lg rounded-xl border border-[#03672A]/30 shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-nasalization text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isLogin ? "Welcome Back" : "Join FindChain"}
          </motion.h1>
          <motion.p
            className="text-[#03672A] font-montserrat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLogin ? "Sign in to continue" : "Create your account"}
          </motion.p>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center text-red-300"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FiAlertCircle className="mr-2" />
              <span className="font-montserrat text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success message for new users */}
        <AnimatePresence>
          {isNewUser && (
            <motion.div
              className="mb-4 p-3 bg-[#03672A]/20 border border-[#03672A]/50 rounded-lg flex items-center text-[#03672A]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FiCheckCircle className="mr-2" />
              <span className="font-montserrat text-sm">
                Welcome! Your unique ID:{" "}
                <span className="font-bold">{uniqueId}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-[#03672A]" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 bg-[#030502]/50 border border-[#03672A]/30 rounded-lg text-white font-montserrat focus:outline-none focus:ring-2 focus:ring-[#03672A] focus:border-transparent"
                  required={!isLogin}
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-[#03672A]" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-[#030502]/50 border border-[#03672A]/30 rounded-lg text-white font-montserrat focus:outline-none focus:ring-2 focus:ring-[#03672A] focus:border-transparent"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-[#03672A]" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-[#030502]/50 border border-[#03672A]/30 rounded-lg text-white font-montserrat focus:outline-none focus:ring-2 focus:ring-[#03672A] focus:border-transparent"
                required
              />
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-[#03672A] hover:bg-[#046A29] text-white font-montserrat rounded-lg transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </motion.button>
        </form>

        {/* Google sign in */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#03672A]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#030502] text-[#03672A] font-montserrat">
                Or continue with
              </span>
            </div>
          </div>

          <motion.button
            onClick={signInWithGoogle}
            className="mt-4 w-full py-3 bg-white hover:bg-gray-100 text-gray-700 font-montserrat rounded-lg flex items-center justify-center transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            <FcGoogle className="mr-2 text-xl" />
            Google
          </motion.button>
        </div>

        {/* Toggle auth mode */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-[#03672A] hover:text-[#046A29] font-montserrat text-sm transition-colors duration-300"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </animated.div>
    </div>
  );
};

export default Auth;
