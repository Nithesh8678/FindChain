import React, { useEffect } from "react";
import Home from "./components/Home";
import { loadFont } from "./utils/fontLoader";
import { debugFontLoading } from "./utils/fontDebug";
import WalletProvider from "./components/WalletProvider";
import "./index.css";

function App() {
  useEffect(() => {
    // Load the fonts
    loadFont("Nasalization");
    loadFont("Montserrat");

    // Debug font loading
    debugFontLoading();
  }, []);

  return (
    <WalletProvider>
      <div className="App">
        <Home />
      </div>
    </WalletProvider>
  );
}

export default App;
