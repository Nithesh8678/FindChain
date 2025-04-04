import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, AuthError } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  signOutUser,
  getUserData,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isNewUser: boolean;
  uniqueId: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [uniqueId, setUniqueId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          if (userData) {
            setUniqueId(userData.uniqueId);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUniqueId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      const user = await signInWithGoogle();
      const userData = await getUserData(user.uid);
      if (userData) {
        setUniqueId(userData.uniqueId);
        setIsNewUser(true);
        navigate("/welcome");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmail(email, password);
      navigate("/dashboard");
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setError(null);
      setLoading(true);
      const user = await registerWithEmail(email, password, displayName);
      const userData = await getUserData(user.uid);
      if (userData) {
        setUniqueId(userData.uniqueId);
        setIsNewUser(true);
        navigate("/welcome");
      }
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOutUser();
      setUser(null);
      setUniqueId(null);
      setIsNewUser(false);
      navigate("/");
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    isNewUser,
    uniqueId,
    signInWithGoogle: handleGoogleSignIn,
    signInWithEmail: handleEmailSignIn,
    registerWithEmail: handleEmailRegister,
    signOut: handleSignOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
