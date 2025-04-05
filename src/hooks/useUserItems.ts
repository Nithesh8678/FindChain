import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

export interface Item {
  id?: string;
  name: string;
  category: string;
  description: string;
  location: string;
  date?: Date | Timestamp;
  dateLost?: string;
  dateFound?: string;
  status: "pending" | "found" | "claimed" | "closed";
  userId: string;
  createdAt: Date | Timestamp;
  contactInfo?: {
    email: string;
    phone?: string;
  };
  reward?: number;
  imageUrl?: string;
}

export const useUserItems = () => {
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user) {
        setLoading(false);
        setError("You must be logged in to view your items");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch lost items
        const lostItemsQuery = query(
          collection(db, `users/${user.uid}/lostItems`),
          orderBy("date", "desc")
        );
        const lostItemsSnapshot = await getDocs(lostItemsQuery);
        const lostItemsData = lostItemsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(),
        })) as Item[];
        setLostItems(lostItemsData);

        // Fetch found items
        const foundItemsQuery = query(
          collection(db, `users/${user.uid}/foundItems`),
          orderBy("date", "desc")
        );
        const foundItemsSnapshot = await getDocs(foundItemsQuery);
        const foundItemsData = foundItemsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(),
        })) as Item[];
        setFoundItems(foundItemsData);
      } catch (err) {
        console.error("Error fetching user items:", err);
        setError("Failed to load your items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [user]);

  return { lostItems, foundItems, loading, error };
};
