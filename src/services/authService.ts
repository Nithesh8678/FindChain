import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// Generate a unique 4-digit ID
const generateUniqueId = () => {
  const prefix = "fcx";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomNum}`;
};

// Check if a user ID already exists
const isUserIdUnique = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return !userDoc.exists();
};

// Generate a unique user ID
const generateUniqueUserId = async () => {
  let userId = generateUniqueId();
  let isUnique = await isUserIdUnique(userId);

  while (!isUnique) {
    userId = generateUniqueId();
    isUnique = await isUserIdUnique(userId);
  }

  return userId;
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if this is the user's first login
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      // Create a new user profile
      const uniqueId = await generateUniqueUserId();
      await setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uniqueId,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } else {
      // Update last login time
      await setDoc(
        doc(db, "users", user.uid),
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Update last login time
    await setDoc(
      doc(db, "users", user.uid),
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

// Register with email and password
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Generate unique ID and create user profile
    const uniqueId = await generateUniqueUserId();
    await setDoc(doc(db, "users", user.uid), {
      displayName,
      email,
      uniqueId,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    return user;
  } catch (error) {
    console.error("Error registering with email:", error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Get user data from Firestore
export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};
