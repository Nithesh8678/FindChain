import React from "react";
import Navbar from "./Navbar";
import Button from "./Button";

const Home: React.FC = () => {
  return (
    <>
      <div
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('./images/home.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Navbar */}
        <Navbar />

        {/* Buttons section with heading */}
        <div className="fixed right-24 top-[calc(28rem+2rem)] z-40">
          {/* Heading and description */}
          <div className="mb-6">
            <h2 className="font-nasalization text-5xl text-white font-bold ml-26 mb-2 tracking-wider">
              FindChain
            </h2>
            <p className="font-montserrat text-md text-white/80 max-w-lg">
              Join our community and help others find their lost belongings
            </p>
          </div>

          {/* Buttons and separator */}
          <div className="flex items-center gap-8 ml-14">
            <Button>Discover</Button>

            {/* Separator Line */}
            <div className="h-[3rem] w-[2px] bg-gradient-to-b from-[#03672A] to-[#046A29] rounded-full opacity-50" />

            <button className="relative overflow-hidden group outline-1 flex items-center gap-2 outline-[#046A29]/80 rounded-full px-8 py-3 font-montserrat text-[#046A29] transition-colors duration-300 ease-in-out">
              {/* Background hover effect */}
              <span className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out origin-center"></span>

              {/* Content inside the button */}
              <span className="relative z-10 flex items-center gap-2">
                {/* Default logo */}
                <img
                  src="./images/logo.png"
                  alt="FindChain Logo"
                  className="h-6 w-auto block group-hover:hidden"
                />
                {/* Hover logo */}
                <img
                  src="./images/logo-green.png"
                  alt="FindChain Logo"
                  className="h-6 w-auto hidden group-hover:block"
                />
                Join Us
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
