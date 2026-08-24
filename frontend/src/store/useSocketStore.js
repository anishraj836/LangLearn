import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  activeCallSignal: null,
  incomingCall: null,

  connectSocket: (authUser) => {
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("call-incoming", (data) => {
      set({ incomingCall: data });
    });

    socket.on("call-accepted", (signal) => {
      set({ activeCallSignal: signal });
    });

    socket.on("call-ended", () => {
      set({ incomingCall: null, activeCallSignal: null });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },

  setIncomingCall: (call) => set({ incomingCall: call }),
  setActiveCallSignal: (signal) => set({ activeCallSignal: signal }),
}));
