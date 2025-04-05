import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiHash,
  FiClock,
  FiPackage,
  FiSearch,
  FiAward,
} from "react-icons/fi";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { LostItem, FoundItem } from "../services/itemService";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user) return;

      try {
        // Fetch lost items
        const lostQuery = query(
          collection(db, "lostItems"),
          where("userId", "==", user.uid)
        );
        const lostSnapshot = await getDocs(lostQuery);
        const lostItemsData = lostSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as LostItem[];

        // Fetch found items
        const foundQuery = query(
          collection(db, "foundItems"),
          where("userId", "==", user.uid)
        );
        const foundSnapshot = await getDocs(foundQuery);
        const foundItemsData = foundSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as FoundItem[];

        setLostItems(lostItemsData);
        setFoundItems(foundItemsData);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [user]);

  const stats = [
    {
      label: "Lost Items",
      value: lostItems.length,
      icon: FiPackage,
      color: "text-red-400",
    },
    {
      label: "Found Items",
      value: foundItems.length,
      icon: FiSearch,
      color: "text-green-400",
    },
    {
      label: "Success Rate",
      value: `${Math.round(
        (foundItems.length / (lostItems.length || 1)) * 100
      )}%`,
      icon: FiAward,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030502] pt-24 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-nasalization">Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[#03672A] hover:bg-[#046A29] rounded-lg font-montserrat transition-colors duration-300"
          >
            Report New Item
          </motion.button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#030502]/80 backdrop-blur-xl border border-[#03672A]/30 rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-[#03672A]/20 rounded-full flex items-center justify-center">
              <FiUser className="w-12 h-12 text-[#03672A]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-nasalization">
                {user?.displayName}
              </h2>
              <div className="flex items-center space-x-4 text-white/70">
                <div className="flex items-center space-x-2">
                  <FiMail className="w-4 h-4" />
                  <span className="font-montserrat">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiHash className="w-4 h-4" />
                  <span className="font-montserrat">ID: {user?.uid}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#030502]/80 backdrop-blur-xl border border-[#03672A]/30 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 font-montserrat">{stat.label}</p>
                  <p className="text-3xl font-nasalization mt-2">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lost Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#030502]/80 backdrop-blur-xl border border-[#03672A]/30 rounded-2xl p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-nasalization mb-4">Lost Items</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : lostItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#030502]/60 border border-[#03672A]/20 rounded-xl p-4"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-nasalization mb-2">
                    {item.name}
                  </h3>
                  <p className="text-white/70 font-montserrat mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-4 text-white/50 text-sm">
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>
                        {new Date(item.dateLost).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiPackage className="w-4 h-4" />
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : item.status === "found"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50">
              No lost items reported yet.
            </div>
          )}
        </motion.div>

        {/* Found Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#030502]/80 backdrop-blur-xl border border-[#03672A]/30 rounded-2xl p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-nasalization mb-4">Found Items</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : foundItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#030502]/60 border border-[#03672A]/20 rounded-xl p-4"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-nasalization mb-2">
                    {item.name}
                  </h3>
                  <p className="text-white/70 font-montserrat mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-4 text-white/50 text-sm">
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>
                        {new Date(item.dateFound).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiPackage className="w-4 h-4" />
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : item.status === "claimed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50">
              No found items reported yet.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
