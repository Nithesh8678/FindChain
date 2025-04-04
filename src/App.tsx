import { useEffect } from "react";
import { loadFont } from "./utils/fontLoader";
import { debugFontLoading } from "./utils/fontDebug";
import WalletProvider from "./components/WalletProvider";
import Home from "./components/Home";
import Leaderboard from "./components/Leaderboard";
import "./index.css";

function App() {
  useEffect(() => {
    // Load fonts
    loadFont("Nasalization");
    loadFont("Montserrat");

    // Debug font loading
    debugFontLoading();
  }, []);

  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#030502] text-white">
        <Home />
        <Leaderboard />
      </div>
    </WalletProvider>
  );
}

export default App;
