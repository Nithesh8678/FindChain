import React from "react";

interface LeaderboardEntry {
  id: number;
  name: string;
  itemsFound: number;
}

const Leaderboard: React.FC = () => {
  // Sample data - replace with actual data from your backend
  const leaderboardData: LeaderboardEntry[] = [
    { id: 1, name: "0x1234...5678", itemsFound: 42 },
    { id: 2, name: "0x8765...4321", itemsFound: 38 },
    { id: 3, name: "0xabcd...efgh", itemsFound: 35 },
    { id: 4, name: "0x2468...1357", itemsFound: 30 },
    { id: 5, name: "0x9876...5432", itemsFound: 28 },
  ];

  return (
    <div className="fixed left-9 top-24 w-80 z-40 mt-24">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h2 className="font-nasalization text-xl text-white tracking-wider">
            Active Leaderboard
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-white/70 font-montserrat text-xs uppercase tracking-wider">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Items Found</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`
                    border-t border-white/5
                    ${index % 2 === 0 ? "bg-white/5" : "bg-white/0"}
                    hover:bg-white/10 transition-all duration-200
                  `}
                >
                  <td className="px-4 py-3 text-white/90 font-montserrat text-sm">
                    #{entry.id}
                  </td>
                  <td className="px-4 py-3 text-white/90 font-montserrat text-sm">
                    {entry.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 font-montserrat text-sm">
                        {entry.itemsFound}
                      </span>
                      <div className="h-1.5 w-16 bg-gradient-to-r from-[#03672A] to-[#046A29] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/30 rounded-full"
                          style={{ width: `${(entry.itemsFound / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with animation */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-[#03672A] animate-pulse" />
            <div className="h-1 w-1 rounded-full bg-[#03672A] animate-pulse delay-100" />
            <div className="h-1 w-1 rounded-full bg-[#03672A] animate-pulse delay-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
