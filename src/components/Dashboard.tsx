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
} from "react-icons/fi";
import {
  getLostItems,
  getFoundItems,
  LostItem,
  FoundItem,
} from "../services/itemService";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const [lostData, foundData] = await Promise.all([
          getLostItems(),
          getFoundItems(),
        ]);
        setLostItems(lostData.items);
        setFoundItems(foundData.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

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

  const ItemCard: React.FC<{
    item: LostItem | FoundItem;
    type: "lost" | "found";
  }> = ({ item, type }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-[#03672A]/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-nasalization text-white mb-2">
            {item.name}
          </h3>
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <FiTag className="text-[#03672A]" />
            <span className="font-montserrat">{item.category}</span>
          </div>
          <p className="text-white/80 font-montserrat mb-4">
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
                {new Date(
                  type === "lost"
                    ? (item as LostItem).dateLost
                    : (item as FoundItem).dateFound
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        {item.imageUrl && (
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={item.imageUrl}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-lg ml-4"
          />
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#030502] to-[#03672A]/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-[60vh]">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 border-4 border-[#03672A] border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#030502] to-[#03672A]/20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-500">
            <h2 className="text-xl font-nasalization mb-2">Error</h2>
            <p className="font-montserrat">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#030502] to-[#03672A]/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-nasalization text-white mb-4">
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#03672A] hover:bg-[#046A29] rounded-xl text-white font-montserrat transition-colors duration-300"
            >
              Report New Item
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
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

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#03672A] transition-colors duration-300 font-montserrat"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("lost")}
              className={`px-6 py-3 rounded-xl font-montserrat transition-all duration-300 ${
                activeTab === "lost"
                  ? "bg-[#03672A] text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Lost Items
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`px-6 py-3 rounded-xl font-montserrat transition-all duration-300 ${
                activeTab === "found"
                  ? "bg-[#03672A] text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Found Items
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6"
          >
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60 font-montserrat">
                  No {activeTab} items found
                </p>
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
          <h2 className="text-2xl font-nasalization text-white mb-6">
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
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
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
                        {match.imageUrl && (
                          <img
                            src={match.imageUrl}
                            alt={match.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
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
                              {match.contactInfo?.phone || "No phone provided"}
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
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
