import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import uploadToCloudinary from "./cloudinaryService";

// Types
export interface LostItem {
  id?: string;
  itemName: string;
  category: string;
  description: string;
  dateLost: string;
  timeLost: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
  rewardAmount?: string;
  imageUrl?: string;
  status: "lost";
  createdAt: Date;
  userId: string;
}

export interface FoundItem {
  id?: string;
  itemName: string;
  category: string;
  description: string;
  dateFound: string;
  timeFound: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
  imageUrl?: string;
  status: "found";
  createdAt: Date;
  userId: string;
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

    // Create a clean object with only the data we want to store in Firestore
    const firestoreData = {
      itemName: data.itemName,
      category: data.category,
      description: data.description,
      dateLost: data.dateLost,
      timeLost: data.timeLost,
      location: data.location,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      rewardAmount: data.rewardAmount,
      imageUrl: imageUrl, // Only the URL string, not the File object
      status: "lost" as const,
      createdAt: new Date(),
      userId: userId,
    };

    // Add document to Firestore
    const docRef = await addDoc(collection(db, "items"), firestoreData);
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

    // Create a clean object with only the data we want to store in Firestore
    const firestoreData = {
      itemName: data.itemName,
      category: data.category,
      description: data.description,
      dateFound: data.dateFound,
      timeFound: data.timeFound,
      location: data.location,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      imageUrl: imageUrl, // Only the URL string, not the File object
      status: "found" as const,
      createdAt: new Date(),
      userId: userId,
    };

    // Add document to Firestore
    const docRef = await addDoc(collection(db, "items"), firestoreData);
    return docRef.id;
  } catch (error) {
    console.error("Error reporting found item:", error);
    throw error;
  }
};

// Get Lost Items with Pagination
export const getLostItems = async (
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  itemsPerPage: number = 10
) => {
  try {
    let q = query(
      collection(db, "items"),
      where("status", "==", "lost"),
      orderBy("createdAt", "desc"),
      limit(itemsPerPage)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const items: LostItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...(doc.data() as Omit<LostItem, "id">) });
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { items, lastVisible };
  } catch (error) {
    console.error("Error getting lost items:", error);
    throw error;
  }
};

// Get Found Items with Pagination
export const getFoundItems = async (
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  itemsPerPage: number = 10
) => {
  try {
    let q = query(
      collection(db, "items"),
      where("status", "==", "found"),
      orderBy("createdAt", "desc"),
      limit(itemsPerPage)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const items: FoundItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...(doc.data() as Omit<FoundItem, "id">) });
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { items, lastVisible };
  } catch (error) {
    console.error("Error getting found items:", error);
    throw error;
  }
};

// Search Items
export const searchItems = async (
  searchTerm: string,
  status: "lost" | "found"
) => {
  try {
    const q = query(
      collection(db, "items"),
      where("status", "==", status),
      where("itemName", ">=", searchTerm),
      where("itemName", "<=", searchTerm + "\uf8ff"),
      orderBy("itemName"),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const items: (LostItem | FoundItem)[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === "lost") {
        items.push({
          id: doc.id,
          ...(data as Omit<LostItem, "id">),
        } as LostItem);
      } else {
        items.push({
          id: doc.id,
          ...(data as Omit<FoundItem, "id">),
        } as FoundItem);
      }
    });

    return items;
  } catch (error) {
    console.error("Error searching items:", error);
    throw error;
  }
};
