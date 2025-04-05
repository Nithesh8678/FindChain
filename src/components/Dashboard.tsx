import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiTag,
  FiUser,
  FiPackage,
  FiAward,
  FiMail,
  FiPhone,
  FiLogOut,
  FiPlus,
  FiLock,
} from "react-icons/fi";
import {
  getUserLostItems,
  getUserFoundItems,
  LostItem,
  FoundItem,
} from "../services/itemService";
import { useAuth } from "../context/AuthContext";
import AIMatches from "./AIMatches";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          console.log("No user found, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Fetching items for user:", user.uid);
        const [userLostItems, userFoundItems] = await Promise.all([
          getUserLostItems(user.uid),
          getUserFoundItems(user.uid),
        ]);

        console.log("Fetched items:", {
          lost: userLostItems,
          found: userFoundItems,
        });
        setLostItems(userLostItems);
        setFoundItems(userFoundItems);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const filteredItems =
    activeTab === "lost"
      ? lostItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : foundItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const stats = [
    {
      label: "Your Lost Items",
      value: lostItems.length,
      icon: FiPackage,
      color: "text-red-400",
    },
    {
      label: "Your Found Items",
      value: foundItems.length,
      icon: FiSearch,
      color: "text-green-400",
    },
    {
      label: "Potential Matches",
      value: lostItems.reduce((count, lostItem) => {
        const matches = foundItems.filter(
          (foundItem) =>
            foundItem.category === lostItem.category &&
            foundItem.location === lostItem.location
        );
        return count + matches.length;
      }, 0),
      icon: FiAward,
      color: "text-yellow-400",
    },
    {
      label: "AI Matches",
      value: "View",
      icon: FiSearch,
      color: "text-[#03672A]",
      link: "/potential-matches",
    },
  ];

  const ItemCard: React.FC<{
    item: LostItem | FoundItem;
    type: "lost" | "found";
  }> = ({ item, type }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(3, 103, 42, 0.3)",
      }}
      className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-[#03672A]/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between p-6">
        <div className="flex-1">
          <h3 className="text-xl font-nasalization text-white mb-2">
            {item.name}
          </h3>
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <span className="px-2 py-1 bg-[#03672A]/20 text-[#03672A] rounded-md text-xs font-montserrat">
              {item.category}
            </span>
          </div>
          <p className="text-white/80 font-montserrat mb-4 line-clamp-2">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-4 text-white/60">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-[#03672A]" />
              <span className="font-montserrat">{item.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-[#03672A]" />
              <span className="font-montserrat">
                {format(
                  type === "lost"
                    ? (item as LostItem).dateLost
                    : (item as FoundItem).dateFound,
                  "MMM dd, yyyy"
                )}
              </span>
            </div>
          </div>
        </div>
        {item.imageUrl ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 overflow-hidden rounded-lg ml-4"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-[#03672A]/30 to-[#046A29]/30 rounded-lg ml-4 flex items-center justify-center">
            <FiTag className="w-8 h-8 text-white/40" />
          </div>
        )}
      </div>

      {type === "lost" && (
        <div className="mt-4 flex justify-end p-6 pt-0">
          <button
            onClick={() => setSelectedItem(item as LostItem)}
            className="px-4 py-2 bg-gradient-to-r from-[#03672A] to-[#046A29] hover:from-[#046A29] hover:to-[#03672A] rounded-lg text-white font-montserrat transition-all duration-300"
          >
            Find Matches
          </button>
        </div>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#03672A] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLock className="w-16 h-16 text-[#03672A] mx-auto mb-4" />
          <h2 className="text-2xl font-nasalization text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-white/60 font-montserrat mb-6">
            Please sign in to access your dashboard.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-[#03672A] to-[#046A29] text-white rounded-xl font-montserrat"
          >
            Sign In
          </motion.button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-500 max-w-md">
          <h2 className="text-xl font-nasalization mb-2">Error</h2>
          <p className="font-montserrat">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030502] via-[#03672A] to-[#046A29] opacity-90 z-0"></div>

      {/* Animated background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: "pulse 15s infinite linear",
          }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-nasalization text-white mb-4 drop-shadow-lg">
                Dashboard
              </h1>
              <div className="flex items-center gap-4 text-white/60">
                <div className="flex items-center gap-2">
                  <FiUser className="text-[#03672A]" />
                  <span className="font-montserrat">
                    {user?.displayName || "User"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="text-[#03672A]" />
                  <span className="font-montserrat">{user?.email}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/report-lost")}
                className="px-4 py-2 bg-gradient-to-r from-[#03672A] to-[#046A29] text-white rounded-xl font-montserrat flex items-center gap-2"
              >
                <FiPlus />
                <span>Report Lost</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/report-found")}
                className="px-4 py-2 bg-gradient-to-r from-[#03672A] to-[#046A29] text-white rounded-xl font-montserrat flex items-center gap-2"
              >
                <FiPlus />
                <span>Report Found</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-white/10 text-white rounded-xl font-montserrat flex items-center gap-2 border border-white/20"
              >
                <FiLogOut />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 ${
                stat.link ? "cursor-pointer hover:border-[#03672A]/50" : ""
              }`}
              onClick={stat.link ? () => navigate(stat.link) : undefined}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 font-montserrat">{stat.label}</p>
                  <p className="text-3xl font-nasalization text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-[#03672A] transition-colors duration-300 font-montserrat backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("lost")}
              className={`px-6 py-3 rounded-xl font-montserrat transition-all duration-300 ${
                activeTab === "lost"
                  ? "bg-gradient-to-r from-[#03672A] to-[#046A29] text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              Lost Items
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`px-6 py-3 rounded-xl font-montserrat transition-all duration-300 ${
                activeTab === "found"
                  ? "bg-gradient-to-r from-[#03672A] to-[#046A29] text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              Found Items
            </button>
          </div>
        </div>

        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-nasalization text-white drop-shadow-lg">
                AI-Powered Matches
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-white/60 hover:text-white font-montserrat"
              >
                Close
              </button>
            </div>
            <AIMatches lostItem={selectedItem} foundItems={foundItems} />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6"
          >
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/20 p-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#03672A]/30 to-[#046A29]/30 rounded-full flex items-center justify-center mb-6">
                    {activeTab === "lost" ? (
                      <FiPackage className="w-10 h-10 text-white/60" />
                    ) : (
                      <FiSearch className="w-10 h-10 text-white/60" />
                    )}
                  </div>
                  <h3 className="text-xl font-nasalization text-white mb-2">
                    No {activeTab} items found
                  </h3>
                  <p className="text-white/60 font-montserrat mb-6 max-w-md">
                    You haven't reported any {activeTab} items yet. Click the
                    button below to report a new item.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      navigate(
                        activeTab === "lost" ? "/report-lost" : "/report-found"
                      )
                    }
                    className="px-6 py-3 bg-gradient-to-r from-[#03672A] to-[#046A29] text-white rounded-xl font-montserrat flex items-center gap-2"
                  >
                    <FiPlus />
                    <span>
                      Report {activeTab === "lost" ? "Lost" : "Found"} Item
                    </span>
                  </motion.button>
                </div>
              </div>
            ) : (
              filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} type={activeTab} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          {lostItems.length > 0 && foundItems.length > 0 ? (
            <>
              <h2 className="text-2xl font-nasalization text-white mb-6 drop-shadow-lg">
                Potential Connections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lostItems.map((lostItem) => {
                  const potentialMatches = foundItems.filter(
                    (foundItem) =>
                      foundItem.category === lostItem.category &&
                      foundItem.location === lostItem.location
                  );

                  if (potentialMatches.length === 0) return null;

                  return (
                    <motion.div
                      key={lostItem.id}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 25px -5px rgba(3, 103, 42, 0.3)",
                      }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                    >
                      <h3 className="text-xl font-nasalization text-white mb-4">
                        {lostItem.name}
                      </h3>
                      <div className="space-y-4">
                        {potentialMatches.map((match) => (
                          <div
                            key={match.id}
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                          >
                            {match.imageUrl ? (
                              <img
                                src={match.imageUrl}
                                alt={match.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-[#03672A]/30 to-[#046A29]/30 rounded-lg flex items-center justify-center">
                                <FiTag className="w-8 h-8 text-white/40" />
                              </div>
                            )}
                            <div>
                              <p className="text-white font-montserrat">
                                {match.name}
                              </p>
                              <p className="text-white/60 text-sm font-montserrat">
                                Found at {match.location}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <FiPhone className="text-[#03672A]" />
                                <span className="text-white/80 text-sm font-montserrat">
                                  {match.contactInfo?.phone ||
                                    "No phone provided"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/20 p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#03672A]/30 to-[#046A29]/30 rounded-full flex items-center justify-center mb-6">
                  <FiSearch className="w-10 h-10 text-white/60" />
                </div>
                <h3 className="text-xl font-nasalization text-white mb-2">
                  No Potential Connections
                </h3>
                <p className="text-white/60 font-montserrat mb-6 max-w-md">
                  To see potential connections, you need to have both lost and
                  found items in your dashboard.
                </p>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/report-lost")}
                    className="px-6 py-3 bg-gradient-to-r from-[#03672A] to-[#046A29] text-white rounded-xl font-montserrat flex items-center gap-2"
                  >
                    <FiPlus />
                    <span>Report Lost Item</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/report-found")}
                    className="px-6 py-3 bg-gradient-to-r from-[#03672A] to-[#046A29] text-white rounded-xl font-montserrat flex items-center gap-2"
                  >
                    <FiPlus />
                    <span>Report Found Item</span>
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
