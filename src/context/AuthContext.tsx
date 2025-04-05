import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { getDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { generateUniqueUserId } from "../utils/generateUniqueUserId";
import { db } from "../config/firebase";

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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [uniqueId, setUniqueId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      setIsNewUser(!userDoc.exists());
      if (!userDoc.exists()) {
        const newUniqueId = await generateUniqueUserId();
        setUniqueId(newUniqueId);
      }
    } catch (err) {
      console.error("Error signing in with Google:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUniqueId = await generateUniqueUserId();
      await setDoc(doc(db, "users", result.user.uid), {
        displayName,
        email,
        uniqueId: newUniqueId,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
      setIsNewUser(true);
      setUniqueId(newUniqueId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await firebaseSignOut(auth);
      setIsNewUser(false);
      setUniqueId(null);
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isNewUser,
    uniqueId,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
