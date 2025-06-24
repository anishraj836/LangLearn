import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
import {rejectFriendRequest,getOutgoingFriendRequests,getMyFriends,getRecommendedUsers,sendFriendRequest,acceptFriendRequest,getFriendRequests,getUserById,updateProfile} from "../controllers/user.controllers.js";
//applying auth middleware route to all
router.use(protectRoute);

router.post("/profile", updateProfile);
router.get("/friends",protectRoute,getMyFriends);
router.get("/",protectRoute,getRecommendedUsers);
router.get("/outgoing-friend-requests",getOutgoingFriendRequests);
router.get("/friend-requests", getFriendRequests);
router.get("/:id", getUserById);
router.post("/friend-request/:id", sendFriendRequest);
router.post("/friend-request/:id/accept", acceptFriendRequest);
router.post("/friend-request/:id/reject", rejectFriendRequest);
router.post("/profile", updateProfile);
export default router;