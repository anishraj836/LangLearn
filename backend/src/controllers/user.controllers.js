import User from "../models/User.js";
import FriendRequest from "../models/friendRequest.js";

export const getRecommendedUsers = async function name(req,res) {
    try{
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUserId}},//exclude current user
                {_id: {$nin: currentUser.friends}},
                {isOnboarded: true}
            ]
        })
        res.status(200).json({recommendedUsers});
    }catch(error){
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};
export const getMyFriends = async function(req,res){
    try{
        const user = await User.findById(req.user.id).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(user.friends);
    }catch(error){
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};
export const sendFriendRequest = async function(req,res){
    try{
        const myId = req.user.id;
        const {id: recipientId} = req.params
        if(myId===recipientId){
            return res.status(400).json({message: "You cannot send a friend request to yourself"});
        }
        //find recipient user
        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message: "Recipient not found"});
        }
        //check if recipient is already a friend
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message: "You are already friends with this user"});
        }
        //check if a request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId}
            ]
        });
        if(existingRequest){
            return res.status(400).json({message: "A Friend request already exists between you and this user"});
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });
        res.status(201).json({friendRequest});

    }
    catch(error){
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const acceptFriendRequest = async function(req,res){
    try{
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({message: "Friend request not found"});
        }
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message: "You are not authorized to accept this friend request"});
        }
        friendRequest.status = "accepted";
        await friendRequest.save();
        
        //add both users to each other's friends list
        const senderId = friendRequest.sender;
        const recipientId = friendRequest.recipient;
        await User.findByIdAndUpdate(senderId, {
            $addToSet: {friends: recipientId}
        });
        await User.findByIdAndUpdate(recipientId, {
            $addToSet: {friends: senderId}
        });
        
        // Delete the friend request after 10 seconds
        setTimeout(async () => {
            try {
                await FriendRequest.findByIdAndDelete(requestId);
                console.log(`Friend request ${requestId} deleted after acceptance`);
            } catch (error) {
                console.error("Error deleting friend request:", error);
            }
        }, 10000); // 10 seconds
        
        res.status(200).json({friendRequest});
    }catch(error){
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const getFriendRequests = async function(req,res){
    try{
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");
        const acceptedRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json({
            incomingRequests,
            acceptedRequests
        });
    }catch(error){
        console.error("Error in getFriendRequests controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const getOutgoingFriendRequests = async function(req,res){
    try{
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(outgoingRequests);
    }catch(error){
        console.error("Error in getOutgoingFriendRequests controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const rejectFriendRequest = async function(req,res){
    try{
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({message: "Friend request not found"});
        }
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message: "You are not authorized to reject this friend request"});
        }
        await FriendRequest.deleteOne({_id: requestId});
        res.status(200).json({success: true, message: "Friend request rejected successfully"});
    }catch(error){
        console.error("Error in rejectFriendRequest controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const getUserById = async function(req,res){
    try{
        const {id} = req.params;
        const user = await User.findById(id).select("fullName profilePic nativeLanguage learningLanguage bio location");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }catch(error){
        console.error("Error in getUserById controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}
// router.get("/friends",protectRoute,getMyFriends);
// router.get("/",protectRoute,getRecommendedUsers)