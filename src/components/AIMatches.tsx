import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiTag,
  FiX,
  FiAward,
} from "react-icons/fi";
import {
  LostItem,
  FoundItem,
  getLostItems,
  getFoundItems,
} from "../services/itemService";
import { findPotentialMatches } from "../services/matchService";

interface MatchResult {
  foundItem: FoundItem;
  matchResult: {
    matchPercentage: number;
    reason: string;
  };
}

interface AIMatchesProps {
  lostItem: LostItem;
  foundItems: FoundItem[];
}

const AIMatches: React.FC<AIMatchesProps> = ({ lostItem, foundItems }) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);

  useEffect(() => {
    const findMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const potentialMatches = await findPotentialMatches(
          lostItem,
          foundItems
        );
        setMatches(potentialMatches);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to find matches");
      } finally {
        setLoading(false);
      }
    };

    findMatches();
  }, [lostItem, foundItems]);

  const MatchCard: React.FC<{ match: MatchResult }> = ({ match }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-[#03672A]/50 transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedMatch(match)}
    >
      <div className="flex items-start gap-6">
        {match.foundItem.imageUrl && (
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={match.foundItem.imageUrl}
            alt={match.foundItem.name}
            className="w-32 h-32 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-nasalization text-white">
              {match.foundItem.name}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#03672A]" />
              <span className="text-white/60 font-montserrat">
                {match.matchResult.matchPercentage}% Match
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-white/60">
              <FiTag className="text-[#03672A]" />
              <span className="font-montserrat">
                {match.foundItem.category}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <FiMapPin className="text-[#03672A]" />
              <span className="font-montserrat">
                {match.foundItem.location}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <FiCalendar className="text-[#03672A]" />
              <span className="font-montserrat">
                {new Date(match.foundItem.dateFound).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className="text-white/80 font-montserrat line-clamp-2 mb-4">
            {match.foundItem.description}
          </p>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/60 font-montserrat italic line-clamp-2">
              "{match.matchResult.reason}"
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const MatchDetail: React.FC<{ match: MatchResult; onClose: () => void }> = ({
    match,
    onClose,
  }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#030502] border border-[#03672A]/30 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-nasalization text-white">
            Match Details
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lost Item */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-nasalization text-white mb-4">
              Lost Item
            </h3>
            {lostItem.imageUrl && (
              <img
                src={lostItem.imageUrl}
                alt={lostItem.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <div className="space-y-3">
              <div>
                <p className="text-white/60 font-montserrat text-sm">Name</p>
                <p className="text-white font-montserrat">{lostItem.name}</p>
              </div>
              <div>
                <p className="text-white/60 font-montserrat text-sm">
                  Category
                </p>
                <p className="text-white font-montserrat">
                  {lostItem.category}
                </p>
              </div>
              <div>
                <p className="text-white/60 font-montserrat text-sm">
                  Location
                </p>
                <p className="text-white font-montserrat">
                  {lostItem.location}
                </p>
              </div>
              <div>
                <p className="text-white/60 font-montserrat text-sm">
                  Date Lost
                </p>
                <p className="text-white font-montserrat">
                  {new Date(lostItem.dateLost).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-white/60 font-montserrat text-sm">
                  Description
                </p>
                <p className="text-white font-montserrat">
                  {lostItem.description}
                </p>
              </div>
              {lostItem.reward && (
                <div>
                  <p className="text-white/60 font-montserrat text-sm">
                    Reward
                  </p>
                  <p className="text-white font-montserrat">
                    {lostItem.reward}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Found Item */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-nasalization text-white mb-4">
              Found Item
            </h3>
            {match.foundItem.imageUrl && (
              <img
                src={match.foundItem.imageUrl}
                alt={match.foundItem.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <div className="space-y-3">
              <div>
                <p className="text-white/60 font-montserrat text-sm">Name</p>
                <p className="text-white font-montserrat">
                  {match.foundItem.name}
                </p>
              </div>
              <div>
                <p className="text-white/60 font-montserrat text-sm">
                  Category
                </p>
                <p className="text-white font-montserrat">
                  {match.foundItem.category}
                </p>
              </div>
              <div>
                <p className="text-white/60 font-montserrat text-sm">
                  Location
                </p>
                <p className="text-white font-montserrat">
                  {match.foundItem.location}
                </p>
              </div>
              <div>
                <p className="text-white/60 font-montserrat text-sm">
                  Date Found
                </p>
                <p className="text-white font-montserrat">
                  {new Date(match.foundItem.dateFound).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-white/60 font-montserrat text-sm">
                  Description
                </p>
                <p className="text-white font-montserrat">
                  {match.foundItem.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Match Analysis */}
        <div className="mt-8 bg-[#03672A]/10 border border-[#03672A]/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiAward className="text-[#03672A] w-6 h-6" />
            <h3 className="text-xl font-nasalization text-white">
              AI Match Analysis
            </h3>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-[#03672A]/20 flex items-center justify-center">
              <span className="text-3xl font-nasalization text-white">
                {match.matchResult.matchPercentage}%
              </span>
            </div>
            <div className="flex-1">
              <p className="text-white/80 font-montserrat">
                {match.matchResult.reason}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-montserrat transition-colors duration-300"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-[#03672A] hover:bg-[#046A29] rounded-lg text-white font-montserrat transition-colors duration-300">
              Contact Finder
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
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
          className="w-12 h-12 border-4 border-[#03672A] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-500">
        <h2 className="text-xl font-nasalization mb-2">Error</h2>
        <p className="font-montserrat">{error}</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 font-montserrat">
          No potential matches found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {matches.map((match) => (
        <MatchCard key={match.foundItem.id} match={match} />
      ))}

      {selectedMatch && (
        <MatchDetail
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
};

export default AIMatches;
