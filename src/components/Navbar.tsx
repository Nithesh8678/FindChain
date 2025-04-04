import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMenu, FiX } from "react-icons/fi";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="backdrop-blur-lg bg-white/10 border border-[#03672A]/30 rounded-2xl shadow-2xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            {/* <Link to="/" className="flex items-center">
              <span className="text-2xl font-nasalization text-white">
                Find<span className="text-[#03672A]">Chain</span>
              </span>
            </Link> */}
            <img
              src="./images/logo.png"
              alt="FindChain Logo"
              className="w-10 h-10 cursor-pointer"
              onClick={() => navigate("/")}
            />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { path: "/", label: "Home" },
                { path: "/report-lost", label: "Report Lost" },
                { path: "/report-found", label: "Report Found" },
                { path: "/leaderboard", label: "Leaderboard" },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="relative text-white/70 hover:text-white font-montserrat transition-colors duration-300 group"
                >
                  {label}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#03672A]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Connect Wallet Button */}
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;
                  const unsupported = ready && chain?.unsupported;

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="px-4 py-2 bg-[#03672A] hover:bg-[#046A29] text-white font-montserrat rounded-lg transition-colors duration-300"
                            >
                              Connect Wallet
                            </button>
                          );
                        }

                        if (unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-montserrat rounded-lg transition-colors duration-300"
                            >
                              Wrong network
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={openChainModal}
                              className="px-4 py-2 bg-[#03672A]/20 hover:bg-[#03672A]/30 text-white font-montserrat flex items-center rounded-lg transition-colors duration-300"
                            >
                              {chain.hasIcon && (
                                <div className="w-6 h-6 mr-2">
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? "Chain icon"}
                                      src={chain.iconUrl}
                                      className="w-full h-full"
                                    />
                                  )}
                                </div>
                              )}
                              {chain.name}
                            </button>
                            <button
                              onClick={openAccountModal}
                              className="px-4 py-2 bg-[#03672A] hover:bg-[#046A29] text-white font-montserrat rounded-lg transition-colors duration-300"
                            >
                              {account.displayName}
                              {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ""}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>

              {/* User Profile Button */}
              <motion.button
                onClick={handleUserClick}
                className="p-2 text-white/70 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUser className="w-6 h-6" />
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white/70 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-2 backdrop-blur-xl bg-[#030502]/80 border border-[#03672A]/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[
                { path: "/", label: "Home" },
                { path: "/report-lost", label: "Report Lost" },
                { path: "/report-found", label: "Report Found" },
                { path: "/leaderboard", label: "Leaderboard" },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="block px-3 py-2 text-white/70 hover:text-white font-montserrat transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
