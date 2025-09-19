"use client";
import { Button } from "@/components/ui/button";
import { ChatEventEnum } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { connectSocket, disconnectSocket } from "@/sockets/socket";
import React, { useEffect, useState } from "react";

type Message = {
  senderId: string;
  message: string;
};

export default function ChatPage() {
  const auth = useAuth(); // { id, email, role, etc. }
  const { user } = auth;
  const [socket, setSocket] = useState<any>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRequests, setChatRequests] = useState<
    { studentId: string; studentEmail: string }[]
  >([]);
  if (!user) return <div>Loading...</div>;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = connectSocket(token!);
    setSocket(socket);

    socket.on(ChatEventEnum.CONNECTED_EVENT, () => {
      console.log("Socket connected");
    });

    // STUDENT: chat started
    socket.on(ChatEventEnum.START_CHAT, ({ roomId, volunteer, studentId }) => {
      console.log("Chat started in room:", roomId, volunteer, studentId);
      if (volunteer) {
        socket.emit(ChatEventEnum.JOIN_ROOM, roomId);
      }
      setRoomId(roomId);
      setMessages([]);
    });

    // VOLUNTEER: see new chat request
    socket.on(ChatEventEnum.NEW_CHAT_REQUEST, (data) => {
      setChatRequests((prev) => [...prev, data]);
    });

    // Both: receive message
    socket.on(ChatEventEnum.RECEIVE_MESSAGE, ({ senderId, message }) => {
      console.log("New message from", senderId, ":", message);
      setMessages((prev) => [...prev, { senderId, message }]);
    });

    socket.on(ChatEventEnum.ERROR_EVENT, (msg) => {
      alert(msg);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleRequestChat = () => {
    console.log("Requesting chat...");
    socket.emit(ChatEventEnum.STUDENT_REQUEST_CHAT);
  };

  const handleAcceptChat = (studentId: string) => {
    socket.emit(ChatEventEnum.VOLUNTEER_ACCEPT_REQUEST, studentId);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !roomId) return;

    socket.emit(ChatEventEnum.SEND_MESSAGE, {
      roomId,
      message: messageInput,
    });

    setMessages((prev) => [
      ...prev,
      { senderId: user?.id, message: messageInput },
    ]);
    setMessageInput("");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Chat Page ({user?.role})</h1>

      {/* STUDENT */}
      {user.role === "student" && !user.volunteer && !roomId && (
        <Button onClick={handleRequestChat}>Request Chat</Button>
      )}

      {/* VOLUNTEER: See incoming requests */}
      {user.role === "student" && user.volunteer && !roomId && (
        <div>
          <h3>Incoming Requests</h3>
          {chatRequests.length === 0 && <p>No requests yet</p>}
          <ul>
            {chatRequests.map((req) => (
              <li key={req.studentId}>
                {req.studentEmail}{" "}
                <Button onClick={() => handleAcceptChat(req.studentId)}>
                  Accept
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat window */}
      {roomId && (
        <div style={{ marginTop: 24 }}>
          <h3>Chat Room</h3>
          <div
            style={{
              border: "1px solid #ccc",
              padding: 12,
              height: 300,
              overflowY: "scroll",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.senderId === user.id ? "right" : "left",
                  margin: "4px 0",
                }}
              >
                <span>{msg.message}</span>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message"
            style={{ width: "80%", marginRight: 8 }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
