import { Star, MessageSquare, Flame } from "lucide-react";
import { Link } from "react-router-dom";

export default function MostCompatibleCard({ user, onSendRequest }) {
  if (!user) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/60 border-2 border-amber-400/40 shadow-2xl backdrop-blur-xl group hover:border-amber-400/80 transition-all duration-300">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500 pointer-events-none" />

      {/* Header Tag */}
      <div className="flex items-center justify-between mb-4">
        <span className="badge badge-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold gap-1.5 border-none shadow-md">
          <Star className="w-4 h-4 fill-black" />
          🌟 MOST COMPATIBLE PARTNER TODAY
        </span>
        <span className="text-2xl font-black text-amber-400">
          {user.matchScore || 98}% MATCH
        </span>
      </div>

      {/* User Info Grid */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={user.profilePic || "https://avatar.iran.liara.run/public/1.png"}
            alt={user.fullName}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400/60 shadow-xl"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
            <span className="badge badge-outline border-purple-400/50 text-purple-300 text-xs font-semibold">
              Native: {user.nativeLanguage} ➔ Learning: {user.learningLanguage}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 italic">
            "{user.bio || "Enthusiastic language partner ready for real-time conversation!"}"
          </p>

          {/* Reason Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(user.matchReasons || [
              "Perfect Mutual Exchange",
              "High Social Proof",
            ]).map((reason, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-[11px] font-semibold text-amber-300 flex items-center gap-1"
              >
                <Flame className="w-3 h-3 text-amber-400" />
                {reason}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 min-w-[140px] w-full md:w-auto">
          <button
            onClick={() => onSendRequest(user._id)}
            className="btn bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black border-none font-bold shadow-lg shadow-amber-500/20"
          >
            Connect Match
          </button>
          <Link
            to={`/chat/${user._id}`}
            className="btn btn-outline border-white/20 text-white hover:bg-white/10 btn-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Direct Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
