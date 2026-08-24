import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount >= 5) return;

    console.log("🌱 Seeding language exchange partners...");

    const hashedPassword = await bcrypt.hash("password123", 10);

    const seedUsers = [
      {
        fullName: "Sofia Rodriguez",
        email: "sofia@example.com",
        password: hashedPassword,
        bio: "Native Spanish speaker & book lover from Madrid. Passionate about helping English learners master conversational idioms!",
        location: "Madrid, Spain",
        nativeLanguage: "Spanish",
        learningLanguage: "English",
        profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        interests: ["Tech", "Books", "Travel", "Cooking"],
        successfulMatchesCount: 28,
        isOnboarded: true,
      },
      {
        fullName: "Jean-Luc Dubois",
        email: "jean@example.com",
        password: hashedPassword,
        bio: "Parisian architect learning English. Love cinema, coffee shops, and deep conversations about art.",
        location: "Paris, France",
        nativeLanguage: "French",
        learningLanguage: "English",
        profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        interests: ["Art", "Architecture", "Cinema", "Coffee"],
        successfulMatchesCount: 19,
        isOnboarded: true,
      },
      {
        fullName: "Kenji Sato",
        email: "kenji@example.com",
        password: hashedPassword,
        bio: "Software developer in Tokyo. Looking to practice spoken English for tech presentations and make global friends!",
        location: "Tokyo, Japan",
        nativeLanguage: "Japanese",
        learningLanguage: "English",
        profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        interests: ["Tech", "Gaming", "Anime", "Music"],
        successfulMatchesCount: 14,
        isOnboarded: true,
      },
      {
        fullName: "Elena Rossi",
        email: "elena@example.com",
        password: hashedPassword,
        bio: "Foodie & tour guide from Florence. Let's exchange Italian and English over virtual coffee!",
        location: "Florence, Italy",
        nativeLanguage: "Italian",
        learningLanguage: "English",
        profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
        interests: ["Food", "History", "Travel", "Photography"],
        successfulMatchesCount: 22,
        isOnboarded: true,
      },
      {
        fullName: "Marcus Weber",
        email: "marcus@example.com",
        password: hashedPassword,
        bio: "Engineering student in Berlin. Excited to practice Spanish and English conversational grammar.",
        location: "Berlin, Germany",
        nativeLanguage: "German",
        learningLanguage: "Spanish",
        profilePic: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
        interests: ["Engineering", "Fitness", "Music", "Tech"],
        successfulMatchesCount: 9,
        isOnboarded: true,
      },
    ];

    await User.insertMany(seedUsers);
    console.log("✅ Successfully seeded 5 language exchange partners!");
  } catch (err) {
    console.error("Error seeding database:", err.message);
  }
};
