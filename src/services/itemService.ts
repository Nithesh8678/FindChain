import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../config/firebase";
import uploadToCloudinary from "./cloudinaryService";
import { Item } from "../hooks/useUserItems";

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

    // Add document to Firestore under the user's lostItems collection
    const docRef = await addDoc(
      collection(db, `users/${userId}/lostItems`),
      firestoreData
    );
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

    // Add document to Firestore under the user's foundItems collection
    const docRef = await addDoc(
      collection(db, `users/${userId}/foundItems`),
      firestoreData
    );
    return docRef.id;
  } catch (error) {
    console.error("Error reporting found item:", error);
    throw error;
  }
};

// Get Lost Items with Pagination
export const getLostItems = async (): Promise<{ items: LostItem[] }> => {
  try {
    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));
    const allLostItems: LostItem[] = [];

    // For each user, get their lost items
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const lostItemsRef = collection(db, `users/${userId}/lostItems`);
      const q = query(
        lostItemsRef,
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as LostItem[];

      allLostItems.push(...items);
    }

    // Sort all items by createdAt date
    allLostItems.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Limit to 50 items
    const limitedItems = allLostItems.slice(0, 50);

    return { items: limitedItems };
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
    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));
    const allFoundItems: FoundItem[] = [];

    // For each user, get their found items
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const foundItemsRef = collection(db, `users/${userId}/foundItems`);
      const q = query(
        foundItemsRef,
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as FoundItem[];

      allFoundItems.push(...items);
    }

    // Sort all items by createdAt date
    allFoundItems.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Limit to 50 items
    const limitedItems = allFoundItems.slice(0, 50);

    return { items: limitedItems };
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
    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));
    const allLostItems: LostItem[] = [];

    // For each user, get their lost items
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const lostItemsRef = collection(db, `users/${userId}/lostItems`);
      const q = query(
        lostItemsRef,
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as LostItem[];

      allLostItems.push(...items);
    }

    // Client-side filtering for better search experience
    return allLostItems.filter(
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
    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));
    const allFoundItems: FoundItem[] = [];

    // For each user, get their found items
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const foundItemsRef = collection(db, `users/${userId}/foundItems`);
      const q = query(
        foundItemsRef,
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as FoundItem[];

      allFoundItems.push(...items);
    }

    // Client-side filtering for better search experience
    return allFoundItems.filter(
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
  userId: string,
  itemId: string,
  status: LostItem["status"]
): Promise<void> => {
  try {
    const itemRef = doc(db, `users/${userId}/lostItems`, itemId);
    await updateDoc(itemRef, { status });
  } catch (error) {
    console.error("Error updating lost item status:", error);
    throw error;
  }
};

// Update Found Item Status
export const updateFoundItemStatus = async (
  userId: string,
  itemId: string,
  status: FoundItem["status"]
): Promise<void> => {
  try {
    const itemRef = doc(db, `users/${userId}/foundItems`, itemId);
    await updateDoc(itemRef, { status });
  } catch (error) {
    console.error("Error updating found item status:", error);
    throw error;
  }
};

export const submitLostItem = async (
  userId: string,
  itemData: Omit<Item, "id" | "date" | "status">
): Promise<string> => {
  try {
    console.log("Submitting lost item for user:", userId);
    console.log("Item data:", itemData);

    // Ensure all required fields are present
    if (
      !itemData.name ||
      !itemData.description ||
      !itemData.category ||
      !itemData.location
    ) {
      throw new Error("Missing required fields");
    }

    // Create the item with the correct structure
    const lostItemData = {
      name: itemData.name,
      category: itemData.category,
      description: itemData.description,
      dateLost: new Date().toISOString(),
      location: itemData.location,
      userId: userId,
      status: "pending" as const,
      createdAt: serverTimestamp(),
      contactInfo: {
        email: itemData.contactInfo?.email || "",
        phone: itemData.contactInfo?.phone || "",
      },
      reward: itemData.reward || 0,
      imageUrl: itemData.imageUrl || "",
    };

    console.log("Creating lost item with data:", lostItemData);

    const docRef = await addDoc(
      collection(db, `users/${userId}/lostItems`),
      lostItemData
    );

    console.log("Successfully added document with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting lost item:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error("Failed to submit lost item. Please try again.");
  }
};

export const submitFoundItem = async (
  userId: string,
  itemData: Omit<Item, "id" | "date" | "status">
): Promise<string> => {
  try {
    console.log("Submitting found item for user:", userId);
    console.log("Item data:", itemData);

    // Ensure all required fields are present
    if (
      !itemData.name ||
      !itemData.description ||
      !itemData.category ||
      !itemData.location
    ) {
      throw new Error("Missing required fields");
    }

    // Create the item with the correct structure
    const foundItemData = {
      name: itemData.name,
      category: itemData.category,
      description: itemData.description,
      dateFound: new Date().toISOString(),
      location: itemData.location,
      userId: userId,
      status: "pending" as const,
      createdAt: serverTimestamp(),
      contactInfo: {
        email: itemData.contactInfo?.email || "",
        phone: itemData.contactInfo?.phone || "",
      },
      imageUrl: itemData.imageUrl || "",
    };

    console.log("Creating found item with data:", foundItemData);

    const docRef = await addDoc(
      collection(db, `users/${userId}/foundItems`),
      foundItemData
    );

    console.log("Successfully added document with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting found item:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error("Failed to submit found item. Please try again.");
  }
};

// Get User's Lost Items
export const getUserLostItems = async (userId: string): Promise<LostItem[]> => {
  try {
    console.log("Fetching lost items for user:", userId);
    const lostItemsRef = collection(db, `users/${userId}/lostItems`);
    const q = query(lostItemsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    console.log("Lost items snapshot:", snapshot.docs.length, "items found");

    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Processing lost item:", doc.id, data);
      return {
        id: doc.id,
        name: data.name,
        category: data.category,
        description: data.description,
        dateLost: data.dateLost,
        location: data.location,
        userId: data.userId,
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
        contactInfo: data.contactInfo || { email: "", phone: "" },
        reward: data.reward || 0,
        imageUrl: data.imageUrl || "",
      } as LostItem;
    });

    console.log("Processed lost items:", items);
    return items;
  } catch (error) {
    console.error("Error fetching lost items:", error);
    if (error instanceof Error && error.message.includes("requires an index")) {
      console.warn("Index required for query, returning empty array");
      return [];
    }
    throw error;
  }
};

// Get User's Found Items
export const getUserFoundItems = async (
  userId: string
): Promise<FoundItem[]> => {
  try {
    console.log("Fetching found items for user:", userId);
    const foundItemsRef = collection(db, `users/${userId}/foundItems`);
    const q = query(foundItemsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    console.log("Found items snapshot:", snapshot.docs.length, "items found");

    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Processing found item:", doc.id, data);
      return {
        id: doc.id,
        name: data.name,
        category: data.category,
        description: data.description,
        dateFound: data.dateFound,
        location: data.location,
        userId: data.userId,
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
        contactInfo: data.contactInfo || { email: "", phone: "" },
        imageUrl: data.imageUrl || "",
      } as FoundItem;
    });

    console.log("Processed found items:", items);
    return items;
  } catch (error) {
    console.error("Error fetching found items:", error);
    if (error instanceof Error && error.message.includes("requires an index")) {
      console.warn("Index required for query, returning empty array");
      return [];
    }
    throw error;
  }
};

// Get All Lost Items (for public viewing)
export const getAllLostItems = async (): Promise<LostItem[]> => {
  try {
    console.log("Fetching all lost items");
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const allLostItems: LostItem[] = [];

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const lostItemsRef = collection(db, `users/${userId}/lostItems`);
      const q = query(
        lostItemsRef,
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          category: data.category,
          description: data.description,
          dateLost: data.dateLost,
          location: data.location,
          userId: data.userId,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
          contactInfo: data.contactInfo || { email: "", phone: "" },
          reward: data.reward || 0,
          imageUrl: data.imageUrl || "",
        } as LostItem;
      });

      allLostItems.push(...items);
    }

    // Sort by most recent first
    allLostItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    console.log("Fetched all lost items:", allLostItems.length);
    return allLostItems;
  } catch (error) {
    console.error("Error fetching all lost items:", error);
    if (error instanceof Error && error.message.includes("requires an index")) {
      console.warn("Index required for query, returning empty array");
      return [];
    }
    throw error;
  }
};
