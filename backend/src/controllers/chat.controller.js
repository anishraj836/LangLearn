import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: myId, recipient: userToChatId },
      { sender: userToChatId, recipient: myId },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json(messages);
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { text, image, callLink } = req.body;
  const { id: recipientId } = req.params;
  const senderId = req.user._id;

  if (!text && !image && !callLink) {
    throw ApiError.badRequest("Message content cannot be empty.");
  }

  const recipientUser = await User.findById(recipientId);
  if (!recipientUser) {
    throw ApiError.notFound("Recipient user not found.");
  }

  const newMessage = await Message.create({
    sender: senderId,
    recipient: recipientId,
    text: text || "",
    image: image || "",
    callLink: callLink || "",
  });

  // Emit real-time message via Socket.io
  const receiverSocketId = getReceiverSocketId(recipientId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json(newMessage);
});
