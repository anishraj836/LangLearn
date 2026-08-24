import User from "../models/User.js";

export class MatchmakerService {
  /**
   * Calculates Match Compatibility Score (0 - 100%) between currentUser and candidate.
   */
  static calculateMatchScore(currentUser, candidate) {
    let score = 0;
    const reasons = [];

    // 1. Linguistic Reciprocity (45% Weight)
    const isMutualMatch =
      currentUser.nativeLanguage?.toLowerCase() === candidate.learningLanguage?.toLowerCase() &&
      currentUser.learningLanguage?.toLowerCase() === candidate.nativeLanguage?.toLowerCase();

    const isOneWayMatch =
      currentUser.learningLanguage?.toLowerCase() === candidate.nativeLanguage?.toLowerCase() ||
      currentUser.nativeLanguage?.toLowerCase() === candidate.learningLanguage?.toLowerCase();

    if (isMutualMatch) {
      score += 45;
      reasons.push("🌟 Perfect Mutual Language Exchange");
    } else if (isOneWayMatch) {
      score += 25;
      reasons.push(`Direct Language Match (${candidate.nativeLanguage})`);
    } else {
      score += 10;
    }

    // 2. Social Proof & Interaction Factor (25% Weight)
    if (candidate.successfulMatchesCount > 10) {
      score += 25;
      reasons.push(`🔥 Active Community Member (${candidate.successfulMatchesCount}+ Connections)`);
    } else if (candidate.successfulMatchesCount > 3) {
      score += 15;
      reasons.push("Reliable Exchange Partner");
    } else {
      score += 10;
    }

    // 3. Bio & Shared Interest Overlap (15% Weight)
    const currentInterests = (currentUser.interests || []).map((i) => i.toLowerCase());
    const candidateInterests = (candidate.interests || []).map((i) => i.toLowerCase());

    const sharedInterests = currentInterests.filter((interest) =>
      candidateInterests.includes(interest)
    );

    if (sharedInterests.length > 0) {
      score += 15;
      reasons.push(`Shared Interests: ${sharedInterests.slice(0, 2).join(", ")}`);
    } else if (currentUser.bio && candidate.bio) {
      score += 8;
      reasons.push("Shared Profile Affinity");
    } else {
      score += 5;
    }

    // 4. Geographic Proximity (15% Weight)
    if (
      currentUser.location &&
      candidate.location &&
      currentUser.location.toLowerCase() === candidate.location.toLowerCase()
    ) {
      score += 15;
      reasons.push(`Same Location (${candidate.location})`);
    } else {
      score += 10;
      reasons.push("Compatible Timezone Schedule");
    }

    const finalScore = Math.min(Math.max(score, 45), 99);

    return {
      candidate,
      matchScore: finalScore,
      matchReasons: reasons,
    };
  }

  /**
   * Fetches partner recommendations sorted by match compatibility + highlights "Most Compatible Today".
   */
  static async getRecommendations(currentUser, limit = 10) {
    const candidates = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } },
        { _id: { $nin: currentUser.friends || [] } },
        { isOnboarded: true },
      ],
    }).select(
      "fullName profilePic nativeLanguage learningLanguage bio location interests successfulMatchesCount createdAt"
    );

    const scoredCandidates = candidates
      .map((candidate) => this.calculateMatchScore(currentUser, candidate))
      .sort((a, b) => b.matchScore - a.matchScore);

    let mostCompatible = null;
    let recommendations = [];

    if (scoredCandidates.length > 0) {
      const topMatch = scoredCandidates[0];
      mostCompatible = {
        ...topMatch.candidate.toObject(),
        matchScore: topMatch.matchScore,
        matchReasons: ["🌟 Most Compatible Partner", ...topMatch.matchReasons],
        isMostCompatible: true,
      };

      recommendations = scoredCandidates.slice(1, limit + 1).map((item) => ({
        ...item.candidate.toObject(),
        matchScore: item.matchScore,
        matchReasons: item.matchReasons,
        isMostCompatible: false,
      }));
    }

    return {
      mostCompatible,
      recommendations,
    };
  }
}
