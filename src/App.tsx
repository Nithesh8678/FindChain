import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadFont } from "./utils/fontLoader";
import { debugFontLoading } from "./utils/fontDebug";
import WalletProvider from "./components/WalletProvider";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import LoadingScreen from "./components/LoadingScreen";
import LoadingProvider, { useLoading } from "./context/LoadingContext";
import "./index.css";
import ReportLost from "./components/ReportLost";
import ReportFound from "./components/ReportFound";

// Wrapper component to access the loading context
const AppContent = () => {
  const { isLoading } = useLoading();

  useEffect(() => {
    // Load fonts
    loadFont("Nasalization");
    loadFont("Montserrat");

    // Debug font loading
    debugFontLoading();
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className="min-h-screen bg-[#030502] text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/report-lost" element={<ReportLost />} />
          <Route path="/report-found" element={<ReportFound />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <WalletProvider>
        <LoadingProvider>
          <AppContent />
        </LoadingProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;
