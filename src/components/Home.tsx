import React from "react";
import Navbar from "./Navbar";

const Home: React.FC = () => {
  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('./images/home.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
        <div className="text-center text-white p-8">
          <h1 className="font-nasalization text-6xl mb-4 uppercase tracking-wider animate-fade-in-down">
            Welcome to FindChain
          </h1>
          <p className="font-montserrat text-2xl font-medium opacity-90 animate-fade-in-up">
            Discover the Future of Blockchain
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
