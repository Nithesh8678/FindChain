import React from "react";
import "../fonts.css";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="font-nasalization text-2xl text-white tracking-wider">
                FindChain
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <a
                  href="#about"
                  className="text-white/90 hover:text-white font-montserrat text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  About
                </a>
                <a
                  href="#report-lost"
                  className="text-white/90 hover:text-white font-montserrat text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  Report Lost
                </a>
                <a
                  href="#report-found"
                  className="text-white/90 hover:text-white font-montserrat text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  Report Found
                </a>
                <a
                  href="#leaderboard"
                  className="text-white/90 hover:text-white font-montserrat text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  Leaderboard
                </a>
                <button className="bg-gradient-to-r from-[#03672A] to-[#046A29] text-white px-6 py-2 rounded-full font-montserrat text-sm font-medium hover:from-[#046A29] hover:to-[#03672A] transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                  Connect Wallet
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white hover:text-white/80">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
