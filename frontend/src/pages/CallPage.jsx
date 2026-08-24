import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, PhoneOff, UserCheck, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import useAuthUser from "../hooks/useAuthUser";
import { useSocketStore } from "../store/useSocketStore";
import PageLoader from "../components/PageLoader";

export default function CallPage() {
  const { id: roomId } = useParams();
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get("targetId");

  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const { socket } = useSocketStore();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callStatus, setCallStatus] = useState("Initializing WebRTC call...");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    let streamInstance = null;

    const startCall = async () => {
      try {
        setCallStatus("Accessing camera & microphone...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamInstance = stream;
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize PeerConnection
        const peer = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        });

        peerRef.current = peer;

        // Add local tracks to peer
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));

        // Handle incoming remote track
        peer.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // ICE candidate exchange
        peer.onicecandidate = (event) => {
          if (event.candidate && targetId && socket) {
            socket.emit("ice-candidate", {
              to: targetId,
              candidate: event.candidate,
            });
          }
        };

        setCallStatus("Connected to WebRTC Audio/Video Room");
      } catch (err) {
        console.error("Error accessing media devices:", err);
        toast.error("Could not access camera or microphone.");
        setCallStatus("Media Access Denied");
      }
    };

    startCall();

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach((t) => t.stop());
      }
      if (peerRef.current) {
        peerRef.current.close();
      }
    };
  }, [roomId, targetId, socket]);

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    if (socket && targetId) {
      socket.emit("end-call", { to: targetId });
    }
    navigate("/");
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-4 lg:p-6 overflow-hidden">
      {/* Header Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h2 className="font-bold text-sm text-white">LangLearn P2P WebRTC Video Room</h2>
            <p className="text-xs text-slate-400">{callStatus}</p>
          </div>
        </div>
        <span className="badge badge-accent font-bold text-xs">Room: {roomId.slice(0, 8)}...</span>
      </div>

      {/* Main Video Streams Container */}
      <div className="w-full max-w-5xl flex-1 my-4 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {/* Remote Video Stream */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteStream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-900/90 backdrop-blur-md">
              <UserCheck className="w-12 h-12 text-slate-500 mb-2 animate-bounce" />
              <p className="font-semibold text-sm text-slate-300">Waiting for peer to join...</p>
              <p className="text-xs text-slate-500">Share your call room link in chat to connect!</p>
            </div>
          )}
          <span className="absolute bottom-4 left-4 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-xs font-semibold">
            Partner Stream
          </span>
        </div>

        {/* Local Self Stream */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {!isVideoOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-500 font-semibold text-xs">
              Camera Off
            </div>
          )}
          <span className="absolute bottom-4 left-4 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-xs font-semibold">
            You ({authUser?.fullName})
          </span>
        </div>
      </div>

      {/* Control Buttons Footer */}
      <div className="flex items-center gap-4 p-3 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl shadow-2xl">
        <button
          onClick={toggleMic}
          className={`btn btn-circle ${isMicOn ? "btn-ghost text-white" : "btn-error"}`}
          title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`btn btn-circle ${isVideoOn ? "btn-ghost text-white" : "btn-error"}`}
          title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={handleEndCall}
          className="btn btn-error btn-circle shadow-lg shadow-red-500/30"
          title="End Call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}