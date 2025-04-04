import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiUser } from "react-icons/fi";
import { format } from "date-fns";

// Types
interface User {
  id: string;
  rank: number;
  username: string;
  profilePicture?: string;
  points: number;
  itemsFound: number;
  lastFoundDate: Date;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
}

const ITEMS_PER_PAGE = 10;

// Mock data - Replace with your actual data
const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  rank: i + 1,
  username: `User${i + 1}`,
  profilePicture: undefined,
  points: Math.floor(Math.random() * 10000),
  itemsFound: Math.floor(Math.random() * 100),
  lastFoundDate: new Date(Date.now() - Math.random() * 10000000000),
  tier:
    i < 10
      ? "Diamond"
      : i < 20
      ? "Platinum"
      : i < 30
      ? "Gold"
      : i < 40
      ? "Silver"
      : "Bronze",
}));

const getTierColor = (tier: User["tier"]) => {
  switch (tier) {
    case "Diamond":
      return "from-blue-400 to-purple-400";
    case "Platinum":
      return "from-purple-400 to-pink-400";
    case "Gold":
      return "from-yellow-400 to-amber-400";
    case "Silver":
      return "from-gray-300 to-gray-400";
    case "Bronze":
      return "from-amber-600 to-amber-700";
  }
};

const Leaderboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  const totalPages = Math.ceil(mockUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = mockUsers.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#030502] to-[#03672A]/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#03672A]/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#046A29]/10 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2" />

          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(3, 103, 42, 0)",
                "0 0 0 10px rgba(3, 103, 42, 0.1)",
                "0 0 0 20px rgba(3, 103, 42, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="relative mb-8"
          >
            <h1 className="font-nasalization text-4xl text-white mb-2 tracking-wider text-center">
              Leaderboard
            </h1>
            <p className="text-white/60 text-center font-montserrat">
              Top finders in the community
            </p>
          </motion.div>

          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 mb-4 px-4 py-2 text-white/80 font-montserrat text-sm font-semibold">
            <div>Rank</div>
            <div className="col-span-2">User</div>
            <div>Points</div>
            <div>Items Found</div>
            <div>Last Found</div>
          </div>

          {/* Table Body */}
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              {currentUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className={`grid grid-cols-6 gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    hoveredUser === user.id
                      ? "bg-white/10 transform scale-[1.02]"
                      : "bg-white/5"
                  }`}
                  onMouseEnter={() => setHoveredUser(user.id)}
                  onMouseLeave={() => setHoveredUser(null)}
                >
                  {/* Rank */}
                  <div className="flex items-center">
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-nasalization
                      ${user.rank <= 3 ? "bg-gradient-to-r" : "bg-white/10"}
                      ${user.rank === 1 ? "from-yellow-400 to-amber-400" : ""}
                      ${user.rank === 2 ? "from-gray-300 to-gray-400" : ""}
                      ${user.rank === 3 ? "from-amber-600 to-amber-700" : ""}
                    `}
                    >
                      {user.rank}
                    </div>
                  </div>

                  {/* User */}
                  <div className="col-span-2 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#03672A] to-[#046A29] flex items-center justify-center">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-montserrat">
                        {user.username}
                      </span>
                      <div
                        className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getTierColor(
                          user.tier
                        )} text-white font-medium`}
                      >
                        {user.tier}
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="flex items-center">
                    <span className="text-white font-montserrat">
                      {user.points.toLocaleString()}
                    </span>
                  </div>

                  {/* Items Found */}
                  <div className="flex items-center">
                    <span className="text-white font-montserrat">
                      {user.itemsFound}
                    </span>
                  </div>

                  {/* Last Found */}
                  <div className="flex items-center text-white/80 text-sm">
                    {format(user.lastFoundDate, "MMM dd, yyyy")}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-white/60 font-montserrat text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl font-montserrat flex items-center space-x-2 transition-all duration-300
                  ${
                    currentPage === 1
                      ? "bg-white/5 text-white/40 cursor-not-allowed"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <FiChevronLeft />
                <span>Previous</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl font-montserrat flex items-center space-x-2 transition-all duration-300
                  ${
                    currentPage === totalPages
                      ? "bg-white/5 text-white/40 cursor-not-allowed"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <span>Next</span>
                <FiChevronRight />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
