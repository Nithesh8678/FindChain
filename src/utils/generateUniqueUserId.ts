import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const generateRandomId = () => {
  const prefix = "fcx";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomNum}`;
};

export const generateUniqueUserId = async (): Promise<string> => {
  let uniqueId = generateRandomId();
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    const userDoc = await getDoc(doc(db, "users", uniqueId));
    if (!userDoc.exists()) {
      isUnique = true;
    } else {
      uniqueId = generateRandomId();
      attempts++;
    }
  }

  if (!isUnique) {
    throw new Error(
      "Failed to generate a unique user ID after multiple attempts"
    );
  }

  return uniqueId;
};
