import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import WalletProvider from "./components/WalletProvider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ReportLost from "./components/ReportLost";
import ReportFound from "./components/ReportFound";
import Leaderboard from "./components/Leaderboard";
import Auth from "./components/Auth";
import Welcome from "./components/Welcome";
import LoadingScreen from "./components/LoadingScreen";
import About from "./components/About";
import Dashboard from "./components/Dashboard";

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

// Public Route component (redirects to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isLoading } = useLoading();
  const { user, uniqueId } = useAuth();

  return (
    <>
      {isLoading && <LoadingScreen isLoading={true} />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome
                userName={user?.displayName || "User"}
                uniqueId={uniqueId || ""}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Load fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <WalletProvider>
          <LoadingProvider>
            <AppContent />
          </LoadingProvider>
        </WalletProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
