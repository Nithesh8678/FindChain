import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiAward,
  FiStar,
  FiTrendingUp,
  FiZap,
  FiShield,
  FiX,
} from "react-icons/fi";
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
  level: number;
  streak: number;
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
  level: Math.floor(Math.random() * 50) + 1,
  streak: Math.floor(Math.random() * 30) + 1,
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

const getTierIcon = (tier: User["tier"]) => {
  switch (tier) {
    case "Diamond":
      return <FiShield className="w-5 h-5" />;
    case "Platinum":
      return <FiShield className="w-5 h-5" />;
    case "Gold":
      return <FiAward className="w-5 h-5" />;
    case "Silver":
      return <FiStar className="w-5 h-5" />;
    case "Bronze":
      return <FiAward className="w-5 h-5" />;
  }
};

const Leaderboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(mockUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = mockUsers.slice(startIndex, endIndex);
  const topThreeUsers = mockUsers.slice(0, 3);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        y: [null, -20],
        opacity: [0.2, 0.8, 0.2],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        },
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [controls]);

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

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            <h1 className="font-nasalization text-5xl text-white mb-2 tracking-wider text-center drop-shadow-lg">
              Leaderboard
            </h1>
            <p className="text-white/60 text-center font-montserrat text-lg">
              Top finders in the community
            </p>
          </motion.div>

          {/* Top 3 Podium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="font-nasalization text-2xl text-white mb-6 text-center">
              Top Performers
            </h2>
            <div className="flex justify-center items-end gap-4 h-64">
              {/* Second Place */}
              {topThreeUsers[1] && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center mb-2 border-2 border-white/30 shadow-lg">
                      {topThreeUsers[1].profilePicture ? (
                        <img
                          src={topThreeUsers[1].profilePicture}
                          alt={topThreeUsers[1].username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center border-2 border-white/30">
                      <span className="font-nasalization text-white">2</span>
                    </div>
                  </div>
                  <div className="w-24 h-32 bg-gradient-to-b from-gray-300/80 to-gray-400/80 rounded-t-xl backdrop-blur-sm border border-white/20 flex flex-col items-center justify-end p-2">
                    <span className="text-white font-montserrat text-sm truncate w-full text-center">
                      {topThreeUsers[1].username}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <FiTrendingUp className="text-white/80 w-3 h-3" />
                      <span className="text-white/80 text-xs font-montserrat">
                        {topThreeUsers[1].points.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* First Place */}
              {topThreeUsers[0] && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 flex items-center justify-center mb-2 border-2 border-white/30 shadow-lg">
                      {topThreeUsers[0].profilePicture ? (
                        <img
                          src={topThreeUsers[0].profilePicture}
                          alt={topThreeUsers[0].username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 flex items-center justify-center border-2 border-white/30">
                      <span className="font-nasalization text-white">1</span>
                    </div>
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                    >
                      <FiAward className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  </div>
                  <div className="w-28 h-40 bg-gradient-to-b from-yellow-400/80 to-amber-400/80 rounded-t-xl backdrop-blur-sm border border-white/20 flex flex-col items-center justify-end p-2">
                    <span className="text-white font-montserrat text-sm font-bold truncate w-full text-center">
                      {topThreeUsers[0].username}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <FiTrendingUp className="text-white/80 w-3 h-3" />
                      <span className="text-white/80 text-xs font-montserrat">
                        {topThreeUsers[0].points.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Third Place */}
              {topThreeUsers[2] && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center mb-2 border-2 border-white/30 shadow-lg">
                      {topThreeUsers[2].profilePicture ? (
                        <img
                          src={topThreeUsers[2].profilePicture}
                          alt={topThreeUsers[2].username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center border-2 border-white/30">
                      <span className="font-nasalization text-white">3</span>
                    </div>
                  </div>
                  <div className="w-24 h-28 bg-gradient-to-b from-amber-600/80 to-amber-700/80 rounded-t-xl backdrop-blur-sm border border-white/20 flex flex-col items-center justify-end p-2">
                    <span className="text-white font-montserrat text-sm truncate w-full text-center">
                      {topThreeUsers[2].username}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <FiTrendingUp className="text-white/80 w-3 h-3" />
                      <span className="text-white/80 text-xs font-montserrat">
                        {topThreeUsers[2].points.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 mb-4 px-4 py-3 text-white/80 font-montserrat text-sm font-semibold bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
            <div>Rank</div>
            <div className="col-span-2">User</div>
            <div>Level</div>
            <div>Points</div>
            <div>Items Found</div>
            <div>Streak</div>
          </div>

          {/* Table Body */}
          <div className="space-y-2" ref={containerRef}>
            <AnimatePresence mode="wait">
              {currentUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className={`grid grid-cols-7 gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    hoveredUser === user.id
                      ? "bg-white/10 transform scale-[1.02] shadow-lg shadow-[#03672A]/20"
                      : "bg-white/5 hover:bg-white/8"
                  }`}
                  onMouseEnter={() => setHoveredUser(user.id)}
                  onMouseLeave={() => setHoveredUser(null)}
                  onClick={() => handleUserClick(user)}
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
                        )} text-white font-medium flex items-center gap-1`}
                      >
                        {getTierIcon(user.tier)}
                        {user.tier}
                      </div>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-1">
                      <FiZap className="text-[#03672A]" />
                      <span className="text-white font-montserrat">
                        {user.level}
                      </span>
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

                  {/* Streak */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-1">
                      <FiTrendingUp className="text-[#03672A]" />
                      <span className="text-white font-montserrat">
                        {user.streak} days
                      </span>
                    </div>
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
                      : "bg-gradient-to-r from-[#03672A] to-[#046A29] text-white hover:from-[#046A29] hover:to-[#03672A]"
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
                      : "bg-gradient-to-r from-[#03672A] to-[#046A29] text-white hover:from-[#046A29] hover:to-[#03672A]"
                  }`}
              >
                <span>Next</span>
                <FiChevronRight />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeUserDetails}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#030502] border border-[#03672A]/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-nasalization text-white">
                  User Profile
                </h2>
                <button
                  onClick={closeUserDetails}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#03672A] to-[#046A29] flex items-center justify-center mb-4 border-4 border-white/20">
                    {selectedUser.profilePicture ? (
                      <img
                        src={selectedUser.profilePicture}
                        alt={selectedUser.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-nasalization text-white mb-2">
                    {selectedUser.username}
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r ${getTierColor(
                      selectedUser.tier
                    )} text-white font-medium flex items-center gap-2 mb-4`}
                  >
                    {getTierIcon(selectedUser.tier)}
                    {selectedUser.tier}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FiZap className="text-[#03672A]" />
                        <span className="text-white/60 font-montserrat">
                          Level
                        </span>
                      </div>
                      <div className="text-2xl font-nasalization text-white">
                        {selectedUser.level}
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#03672A] to-[#046A29] rounded-full"
                          style={{
                            width: `${(selectedUser.level % 10) * 10}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FiTrendingUp className="text-[#03672A]" />
                        <span className="text-white/60 font-montserrat">
                          Streak
                        </span>
                      </div>
                      <div className="text-2xl font-nasalization text-white">
                        {selectedUser.streak} days
                      </div>
                      <div className="text-white/60 text-sm font-montserrat mt-1">
                        Keep it going!
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FiAward className="text-[#03672A]" />
                        <span className="text-white/60 font-montserrat">
                          Points
                        </span>
                      </div>
                      <div className="text-2xl font-nasalization text-white">
                        {selectedUser.points.toLocaleString()}
                      </div>
                      <div className="text-white/60 text-sm font-montserrat mt-1">
                        Total earned
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FiStar className="text-[#03672A]" />
                        <span className="text-white/60 font-montserrat">
                          Items Found
                        </span>
                      </div>
                      <div className="text-2xl font-nasalization text-white">
                        {selectedUser.itemsFound}
                      </div>
                      <div className="text-white/60 text-sm font-montserrat mt-1">
                        Last:{" "}
                        {format(selectedUser.lastFoundDate, "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-nasalization text-white mb-3">
                      Achievements
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col items-center"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#03672A] to-[#046A29] flex items-center justify-center mb-2">
                            <FiStar className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-white/80 text-xs font-montserrat text-center">
                            Achievement {i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
