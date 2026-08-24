import User from "../models/User.js";
import FriendRequest from "../models/friendRequest.js";
import { MatchmakerService } from "../services/matchmaker.service.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const getRecommendedUsers = asyncHandler(async (req, res) => {
  const result = await MatchmakerService.getRecommendations(req.user, 12);
  res.status(200).json(result);
});

export const getMyFriends = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("friends")
    .populate("friends", "fullName profilePic nativeLanguage learningLanguage bio location");
  res.status(200).json(user ? user.friends : []);
});

export const sendFriendRequest = asyncHandler(async (req, res) => {
  const myId = req.user.id;
  const { id: recipientId } = req.params;

  if (myId === recipientId) {
    throw ApiError.badRequest("You cannot send a friend request to yourself.");
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    throw ApiError.notFound("Recipient user not found.");
  }

  if (recipient.friends.includes(myId)) {
    throw ApiError.badRequest("You are already friends with this user.");
  }

  const existingRequest = await FriendRequest.findOne({
    $or: [
      { sender: myId, recipient: recipientId },
      { sender: recipientId, recipient: myId },
    ],
  });

  if (existingRequest) {
    throw ApiError.badRequest("A friend request already exists between you and this user.");
  }

  const friendRequest = await FriendRequest.create({
    sender: myId,
    recipient: recipientId,
  });

  res.status(201).json({ friendRequest });
});

export const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { id: requestId } = req.params;

  const friendRequest = await FriendRequest.findById(requestId);
  if (!friendRequest) {
    throw ApiError.notFound("Friend request not found.");
  }

  if (friendRequest.recipient.toString() !== req.user.id) {
    throw ApiError.forbidden("You are not authorized to accept this friend request.");
  }

  friendRequest.status = "accepted";
  await friendRequest.save();

  const senderId = friendRequest.sender;
  const recipientId = friendRequest.recipient;

  await User.findByIdAndUpdate(senderId, {
    $addToSet: { friends: recipientId },
    $inc: { successfulMatchesCount: 1 },
  });

  await User.findByIdAndUpdate(recipientId, {
    $addToSet: { friends: senderId },
    $inc: { successfulMatchesCount: 1 },
  });

  setTimeout(async () => {
    try {
      await FriendRequest.findByIdAndDelete(requestId);
    } catch (err) {
      console.error("Error deleting accepted friend request:", err.message);
    }
  }, 10000);

  res.status(200).json({ friendRequest });
});

export const getFriendRequests = asyncHandler(async (req, res) => {
  const incomingRequests = await FriendRequest.find({
    recipient: req.user.id,
    status: "pending",
  }).populate("sender", "fullName profilePic nativeLanguage learningLanguage bio location");

  const acceptedRequests = await FriendRequest.find({
    sender: req.user.id,
    status: "accepted",
  }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage bio location");

  res.status(200).json({
    incomingRequests,
    acceptedRequests,
  });
});

export const getOutgoingFriendRequests = asyncHandler(async (req, res) => {
  const outgoingRequests = await FriendRequest.find({
    sender: req.user.id,
    status: "pending",
  }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage bio location");

  res.status(200).json(outgoingRequests);
});

export const rejectFriendRequest = asyncHandler(async (req, res) => {
  const { id: requestId } = req.params;

  const friendRequest = await FriendRequest.findById(requestId);
  if (!friendRequest) {
    throw ApiError.notFound("Friend request not found.");
  }

  if (friendRequest.recipient.toString() !== req.user.id) {
    throw ApiError.forbidden("You are not authorized to reject this friend request.");
  }

  await FriendRequest.deleteOne({ _id: requestId });
  res.status(200).json({ success: true, message: "Friend request rejected successfully." });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select(
    "fullName profilePic nativeLanguage learningLanguage bio location interests"
  );

  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  res.status(200).json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic, interests } = req.body;

  if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
    throw ApiError.badRequest("All profile fields are required.");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
      interests: interests || req.user.interests,
      profilePic: profilePic || req.user.profilePic,
    },
    { new: true }
  );

  if (!updatedUser) {
    throw ApiError.notFound("User not found.");
  }

  res.status(200).json({ success: true, user: updatedUser });
});