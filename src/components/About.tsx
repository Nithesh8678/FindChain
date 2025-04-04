import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Report Lost Items",
      description:
        "Easily report your lost items with detailed descriptions and location data stored securely on the blockchain.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      title: "Find & Return",
      description:
        "Connect with people who have found your items. Our smart contract ensures secure and transparent transactions.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      title: "Earn Rewards",
      description:
        "Get rewarded for helping others find their lost items. Build reputation and earn tokens for your contributions.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#030502] text-white overflow-hidden"
    >
      {/* Hero Section with Video */}
      <motion.div
        style={{ opacity, scale }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
          >
            <source src="/demo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#030502] via-transparent to-[#030502]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-nasalization text-6xl mb-6 tracking-wider"
          >
            About FindChain
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-montserrat text-xl text-white/80"
          >
            A revolutionary blockchain-based platform for finding and returning
            lost items
          </motion.p>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                onMouseEnter={() => setActiveFeature(index)}
                className={`
                  relative p-8 rounded-2xl backdrop-blur-xl
                  ${activeFeature === index ? "bg-white/15" : "bg-white/5"}
                  border border-white/10 transition-all duration-300
                  hover:border-white/20 hover:transform hover:scale-105
                  cursor-pointer
                `}
              >
                <div className="absolute -inset-px bg-gradient-to-br from-[#03672A] to-[#046A29] opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="mb-4 text-[#03672A]">{feature.icon}</div>
                  <h3 className="font-nasalization text-xl mb-4">
                    {feature.title}
                  </h3>
                  <p className="font-montserrat text-white/70">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 py-20 px-4 bg-white/5 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="font-nasalization text-4xl mb-12 text-center">
            How It Works
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-[#03672A] to-[#046A29]" />

            {/* Timeline Steps */}
            {[
              {
                title: "Connect Your Wallet",
                description:
                  "Start by connecting your Web3 wallet to access the FindChain platform securely.",
              },
              {
                title: "Report or Search",
                description:
                  "Report lost items or search through found items in your area using our intuitive interface.",
              },
              {
                title: "Smart Contract Match",
                description:
                  "Our smart contracts automatically match lost items with found reports using location and description data.",
              },
              {
                title: "Secure Return Process",
                description:
                  "Complete the return process through our secure smart contract system with built-in reputation tracking.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`
                  flex items-center mb-12 last:mb-0
                  ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}
                `}
              >
                <div
                  className={`w-1/2 ${
                    index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"
                  }`}
                >
                  <h3 className="font-nasalization text-2xl mb-2">
                    {step.title}
                  </h3>
                  <p className="font-montserrat text-white/70">
                    {step.description}
                  </p>
                </div>
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-[#03672A] border-4 border-[#030502]" />
                </div>
                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: "10K+", label: "Items Found" },
              { value: "5K+", label: "Active Users" },
              { value: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="font-nasalization text-4xl text-[#03672A] mb-2">
                  {stat.value}
                </div>
                <div className="font-montserrat text-white/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
