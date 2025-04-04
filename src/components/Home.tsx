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
    </div>
  );
};

export default Home;
