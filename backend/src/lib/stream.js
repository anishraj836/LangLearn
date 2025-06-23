import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STEAM_API_KEY
const apiSecret = process.env.STEAM_API_SECRET

if(!apiKey||!apiSecret){
    console.log("api key or api secret is missing");
}
const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const createStreamUser = async (userData) => {
    try{
        await streamClient.upsertUsers([userData]);
        return userData;
    }catch(error){
        console.error("error upserting stream user: ", error);
    }
}
//do it later
export const generateStreamToken = (userId) =>{
    try{
        const userIdstr = userId.toString();
        return streamClient.createToken(userIdstr);
    }catch(error){
        console.error("error generating stream token: ", error);
        throw new Error("Failed to generate stream token");
    }
}