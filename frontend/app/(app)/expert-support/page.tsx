"use client";
import { Button } from "@/components/ui/button";
import { ChatEventEnum } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { connectSocket, disconnectSocket } from "@/sockets/socket";
import React, { useEffect, useRef, useState } from "react";

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
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = connectSocket(token!);
    socketRef.current = socket;
    setSocket(socket);

    socket.on(ChatEventEnum.CONNECTED_EVENT, () => {
      console.log("Socket connected");
    });

    const savedRoomId = localStorage.getItem("roomId");
    if (savedRoomId) {
      setRoomId(savedRoomId);
      socket.emit(ChatEventEnum.JOIN_ROOM, savedRoomId);
      socket.emit(ChatEventEnum.GET_MESSAGES, savedRoomId);
    }

    // STUDENT: chat started
    socket.on(ChatEventEnum.START_CHAT, ({ roomId, volunteer, studentId }) => {
      console.log("Chat started in room:", roomId, volunteer, studentId);
      if (volunteer) {
        socket.emit(ChatEventEnum.JOIN_ROOM, roomId);
      }
      setRoomId(roomId);
      localStorage.setItem("roomId", roomId);
      socket.emit(ChatEventEnum.GET_MESSAGES, roomId);
      setMessages([]);
    });

    // VOLUNTEER: see new chat request
    socket.on(ChatEventEnum.NEW_CHAT_REQUEST, (data) => {
      if (data.organizationId !== user.organizationId) return; // only for same org
      if (user.volunteer) {
        setChatRequests((prev) => [...prev, data]);
      }
      // if (data.studentId !== user.id) return; // not for self
    });

    // VOLUNTEER: request accepted by another volunteer
    socket.on(ChatEventEnum.REQUEST_ACCEPTED, ({ studentId }) => {
      setChatRequests((prev) =>
        prev.filter((req) => req.studentId !== studentId)
      );
    });

    // Both: receive message
    socket.on(ChatEventEnum.RECEIVE_MESSAGE, ({ senderId, message }) => {
      console.log("New message from", senderId, ":", message);
      setMessages((prev) => [...prev, { senderId, message }]);
    });

    socket.on(ChatEventEnum.ERROR_EVENT, (msg) => {
      alert(msg);
    });

    socket.on(ChatEventEnum.GET_MESSAGES, (msgs: Message[]) => {
      setMessages(msgs);
    });
    socket.emit(ChatEventEnum.GET_REQUESTS);
    socket.on(
      ChatEventEnum.GET_REQUESTS,
      (requests: { studentId: string; studentEmail: string }[]) => {
        setChatRequests(requests);
      }
    );
    socket.on(ChatEventEnum.CANCEL_REQUEST, ({ studentId }) => {
      setChatRequests((prev) =>
        prev.filter((req) => req.studentId !== studentId)
      );
    });

    socket.on(ChatEventEnum.LEAVE_ROOM, ({ leftRoomId }) => {
      const roomId = localStorage.getItem("roomId");
      console.log("Left room:", leftRoomId, roomId);
      if (leftRoomId === roomId) {
        setRoomId(null);
        setMessages([]);
        localStorage.removeItem("roomId");
        socket.emit(ChatEventEnum.GET_REQUESTS);
      }
    });

    return () => {
      socket.removeAllListeners(); //be cautious—it removes even listeners added by other components.
      disconnectSocket();
    };
  }, []);

  const handleRequestChat = () => {
    console.log("Requesting chat...");
    socket.emit(ChatEventEnum.STUDENT_REQUEST_CHAT);
    alert("Chat request sent. Please wait for a volunteer to accept.");
    const request = {
      studentId: user.id,
      studentEmail: user.email,
    };
    setChatRequests([request]);
  };

  const handleAcceptChat = (studentId: string) => {
    socket.emit(ChatEventEnum.VOLUNTEER_ACCEPT_REQUEST, studentId);
  };

  const handleLeaveRoom = () => {
    if (!roomId) return;
    socket.emit(ChatEventEnum.LEAVE_ROOM, roomId);
    localStorage.removeItem("roomId");
    setRoomId(null);
    setMessages([]);
    socket.emit(ChatEventEnum.GET_REQUESTS);
  };

  const handleCancelRequest = () => {
    socket.emit(ChatEventEnum.CANCEL_REQUEST);
    setChatRequests([]);
    alert("Chat request cancelled.");
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
      {user.role === "student" &&
        !user.volunteer &&
        !roomId &&
        (chatRequests.length > 0 ? (
          <Button onClick={() => handleCancelRequest()}>Cancel Request</Button>
        ) : (
          <Button onClick={handleRequestChat}>Request Chat</Button>
        ))}

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
          <Button onClick={handleLeaveRoom}>Leave chat</Button>
        </div>
      )}
    </div>
  );
}
