import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (!socket) {
    const backend_url =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    socket = io(backend_url, {
      withCredentials: true,
      auth: { token },
    });
  }
  return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
