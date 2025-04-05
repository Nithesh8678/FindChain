import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../config/firebase";
import uploadToCloudinary from "./cloudinaryService";

// Types
export interface LostItem {
  id?: string;
  name: string;
  category: string;
  description: string;
  dateLost: string;
  location: string;
  imageUrl?: string;
  userId: string;
  status: "pending" | "found" | "closed";
  createdAt: Date;
  reward?: number;
  contactInfo?: {
    email: string;
    phone?: string;
  };
}

export interface FoundItem {
  id?: string;
  name: string;
  category: string;
  description: string;
  dateFound: string;
  location: string;
  imageUrl?: string;
  userId: string;
  status: "pending" | "claimed" | "closed";
  createdAt: Date;
  contactInfo?: {
    email: string;
    phone?: string;
  };
}

// Lost Items Collection
const lostItemsCollection = collection(db, "lostItems");

// Found Items Collection
const foundItemsCollection = collection(db, "foundItems");

// Report Lost Item
export const reportLostItem = async (
  data: Omit<LostItem, "createdAt" | "status" | "userId" | "imageUrl">,
  image: File | null,
  userId: string
): Promise<string> => {
  try {
    // First, upload the image to Cloudinary if provided
    let imageUrl: string | undefined;
    if (image) {
      try {
        imageUrl = await uploadToCloudinary(image);
        console.log("Image uploaded to Cloudinary:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        // Continue without the image if upload fails
      }
    }

    // Validate required fields
    if (
      !data.name ||
      !data.category ||
      !data.description ||
      !data.dateLost ||
      !data.location
    ) {
      throw new Error("Missing required fields");
    }

    // Create a clean object with only the data we want to store in Firestore
    const firestoreData = {
      name: data.name || "",
      category: data.category || "",
      description: data.description || "",
      dateLost: data.dateLost || new Date().toISOString(),
      location: data.location || "",
      contactInfo: {
        email: data.contactInfo?.email || "",
        phone: data.contactInfo?.phone || "",
      },
      reward: data.reward || 0,
      imageUrl: imageUrl || "",
      status: "pending" as const,
      createdAt: new Date(),
      userId: userId || "anonymous",
    };

    console.log("Saving to Firestore:", firestoreData);

    // Add document to Firestore
    const docRef = await addDoc(lostItemsCollection, firestoreData);
    return docRef.id;
  } catch (error) {
    console.error("Error reporting lost item:", error);
    throw error;
  }
};

// Report Found Item
export const reportFoundItem = async (
  data: Omit<FoundItem, "createdAt" | "status" | "userId" | "imageUrl">,
  image: File | null,
  userId: string
): Promise<string> => {
  try {
    // First, upload the image to Cloudinary if provided
    let imageUrl: string | undefined;
    if (image) {
      try {
        imageUrl = await uploadToCloudinary(image);
        console.log("Image uploaded to Cloudinary:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        // Continue without the image if upload fails
      }
    }

    // Validate required fields
    if (
      !data.name ||
      !data.category ||
      !data.description ||
      !data.dateFound ||
      !data.location
    ) {
      throw new Error("Missing required fields");
    }

    // Create a clean object with only the data we want to store in Firestore
    const firestoreData = {
      name: data.name || "",
      category: data.category || "",
      description: data.description || "",
      dateFound: data.dateFound || new Date().toISOString(),
      location: data.location || "",
      contactInfo: {
        email: data.contactInfo?.email || "",
        phone: data.contactInfo?.phone || "",
      },
      imageUrl: imageUrl || "",
      status: "pending" as const,
      createdAt: new Date(),
      userId: userId || "anonymous",
    };

    console.log("Saving to Firestore:", firestoreData);

    // Add document to Firestore
    const docRef = await addDoc(foundItemsCollection, firestoreData);
    return docRef.id;
  } catch (error) {
    console.error("Error reporting found item:", error);
    throw error;
  }
};

// Get Lost Items with Pagination
export const getLostItems = async (): Promise<{ items: LostItem[] }> => {
  try {
    const lostItemsRef = collection(db, "lostItems");
    const q = query(
      lostItemsRef,
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as LostItem[];

    return { items };
  } catch (error) {
    console.error("Error getting lost items:", error);
    // Return empty array if index is not ready yet
    if (error instanceof Error && error.message.includes("requires an index")) {
      console.log("Index is being created. Returning empty array for now.");
      return { items: [] };
    }
    throw error;
  }
};

// Get Found Items with Pagination
export const getFoundItems = async (): Promise<{ items: FoundItem[] }> => {
  try {
    const foundItemsRef = collection(db, "foundItems");
    const q = query(
      foundItemsRef,
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as FoundItem[];

    return { items };
  } catch (error) {
    console.error("Error getting found items:", error);
    // Return empty array if index is not ready yet
    if (error instanceof Error && error.message.includes("requires an index")) {
      console.log("Index is being created. Returning empty array for now.");
      return { items: [] };
    }
    throw error;
  }
};

// Search Lost Items
export const searchLostItems = async (
  searchTerm: string
): Promise<LostItem[]> => {
  try {
    const q = query(
      lostItemsCollection,
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as LostItem[];

    // Client-side filtering for better search experience
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching lost items:", error);
    throw error;
  }
};

// Search Found Items
export const searchFoundItems = async (
  searchTerm: string
): Promise<FoundItem[]> => {
  try {
    const q = query(
      foundItemsCollection,
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as FoundItem[];

    // Client-side filtering for better search experience
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching found items:", error);
    throw error;
  }
};

// Update Lost Item Status
export const updateLostItemStatus = async (
  itemId: string,
  status: LostItem["status"]
): Promise<void> => {
  try {
    const itemRef = doc(db, "lostItems", itemId);
    await updateDoc(itemRef, { status });
  } catch (error) {
    console.error("Error updating lost item status:", error);
    throw error;
  }
};

// Update Found Item Status
export const updateFoundItemStatus = async (
  itemId: string,
  status: FoundItem["status"]
): Promise<void> => {
  try {
    const itemRef = doc(db, "foundItems", itemId);
    await updateDoc(itemRef, { status });
  } catch (error) {
    console.error("Error updating found item status:", error);
    throw error;
  }
};
