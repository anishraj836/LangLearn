import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Send, Phone, Video, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import useAuthUser from "../hooks/useAuthUser";
import { useSocketStore } from "../store/useSocketStore";
import { getMessages, sendMessage, getUserById } from "../lib/api";
import PageLoader from "../components/PageLoader";

export default function ChatPage() {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const { socket, onlineUsers } = useSocketStore();

  const [targetUser, setTargetUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const isOnline = onlineUsers.includes(targetUserId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, msgData] = await Promise.all([
          getUserById(targetUserId),
          getMessages(targetUserId),
        ]);
        setTargetUser(userData);
        setMessages(msgData || []);
      } catch (err) {
        toast.error("Could not load chat conversation.");
      } finally {
        setLoading(false);
      }
    };

    if (targetUserId) fetchData();
  }, [targetUserId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg) => {
      if (
        newMsg.sender === targetUserId ||
        newMsg.recipient === targetUserId
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || sending) return;

    const textToSend = inputText;
    setInputText("");
    setSending(true);

    try {
      const newMsg = await sendMessage(targetUserId, { text: textToSend });
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleStartCall = () => {
    const callRoomId = [authUser._id, targetUserId].sort().join("-");
    const callLink = `${window.location.origin}/call/${callRoomId}`;

    sendMessage(targetUserId, {
      text: `📞 I've started a WebRTC video/audio call! Join me here: ${callLink}`,
      callLink,
    });

    navigate(`/call/${callRoomId}?targetId=${targetUserId}`);
  };

  if (loading || !targetUser) return <PageLoader />;

  return (
    <div className="h-[90vh] flex flex-col rounded-3xl bg-base-200/70 border border-base-content/10 backdrop-blur-xl shadow-2xl overflow-hidden max-w-5xl mx-auto my-2">
      {/* Header Bar */}
      <div className="p-4 bg-base-300/80 border-b border-base-content/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={targetUser.profilePic || "https://avatar.iran.liara.run/public/1.png"}
              alt={targetUser.fullName}
              className="w-11 h-11 rounded-2xl object-cover border border-primary/30"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-base-300 ${
                isOnline ? "bg-success" : "bg-gray-400"
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-base-content">
                {targetUser.fullName}
              </h2>
              {targetUser.isVerifiedTutor && (
                <span className="badge badge-success text-[10px] text-white font-bold gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Tutor
                </span>
              )}
            </div>
            <p className="text-xs text-base-content/60">
              {isOnline ? (
                <span className="text-success font-medium">● Online Now</span>
              ) : (
                "Offline"
              )}
              {targetUser.nativeLanguage && ` • Native: ${targetUser.nativeLanguage}`}
            </p>
          </div>
        </div>

        {/* Video Call Trigger */}
        <button
          onClick={handleStartCall}
          className="btn btn-primary btn-sm gap-2 shadow-lg"
        >
          <Video className="w-4 h-4" /> Start Call
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-70">
            <Sparkles className="w-8 h-8 text-primary mb-2 animate-pulse" />
            <p className="text-sm font-semibold text-base-content">
              No messages yet with {targetUser.fullName}
            </p>
            <p className="text-xs text-base-content/60">
              Say hello and start practicing your target language together!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === authUser._id;
            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3.5 rounded-2xl ${
                    isMe
                      ? "bg-primary text-primary-content rounded-br-none shadow-md"
                      : "bg-base-300 text-base-content rounded-bl-none border border-base-content/10 shadow-md"
                  }`}
                >
                  <p className="text-xs font-normal whitespace-pre-wrap">{msg.text}</p>
                  {msg.callLink && (
                    <a
                      href={msg.callLink}
                      className="mt-2 btn btn-xs btn-accent gap-1 text-[11px] font-bold block text-center"
                    >
                      <Video className="w-3.5 h-3.5 inline" /> Join Video Call Room
                    </a>
                  )}
                  <span className="text-[10px] opacity-60 block text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Input */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-base-300/80 border-t border-base-content/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type a message to ${targetUser.fullName}...`}
          className="input input-bordered flex-1 text-xs focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !inputText.trim()}
          className="btn btn-primary btn-circle shadow-lg"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}