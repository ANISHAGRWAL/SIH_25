"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatEventEnum } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { connectSocket, disconnectSocket } from "@/sockets/socket";

type Message = {
  senderId: string;
  message: string;
};

type ChatRequest = {
  studentId: string;
  studentEmail: string;
  organizationId?: string; // if needed
};

export default function ChatPage() {
  const auth = useAuth();
  const { user } = auth;

  const [socket, setSocket] = useState<any>(null);
  const socketRef = useRef<any>(null);

  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [messageInput, setMessageInput] = useState("");

  // Initialize socket once user is present
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found!");
      return;
    }

    const sock = connectSocket(token);
    socketRef.current = sock;
    setSocket(sock);

    // Setup socket listeners
    sock.on(ChatEventEnum.CONNECTED_EVENT, () => {
      console.log("Socket connected");
    });

    // Active room logic
    sock.emit(ChatEventEnum.GET_ACTIVE_ROOM);
    sock.on(ChatEventEnum.GET_ACTIVE_ROOM, ({ savedRoomId }) => {
      console.log("Active room:", savedRoomId);
      if (savedRoomId) {
        setRoomId(savedRoomId);
        sock.emit(ChatEventEnum.JOIN_ROOM, savedRoomId);
        sock.emit(ChatEventEnum.GET_MESSAGES, savedRoomId);
      }
    });

    // START_CHAT: fired when a session has been started/accepted
    sock.on(
      ChatEventEnum.START_CHAT,
      ({ roomId: newRoomId, volunteer, studentId }) => {
        console.log("Chat started:", newRoomId, volunteer, studentId);
        setRoomId(newRoomId);
        setMessages([]); // clear old messages
        sock.emit(ChatEventEnum.GET_MESSAGES, newRoomId);
      }
    );

    // NEW_CHAT_REQUEST: for volunteers
    sock.on(
      ChatEventEnum.NEW_CHAT_REQUEST,
      (req: ChatRequest & { organizationId?: string }) => {
        // Only for same organization
        if (
          req.organizationId &&
          user.organizationId &&
          req.organizationId !== user.organizationId
        ) {
          return;
        }
        if (user.volunteer) {
          setChatRequests((prev) => {
            // avoid duplicates
            const exists = prev.some((r) => r.studentId === req.studentId);
            if (exists) return prev;
            return [...prev, req];
          });
        }
      }
    );

    // REQUEST_ACCEPTED: remove request if accepted elsewhere
    sock.on(ChatEventEnum.REQUEST_ACCEPTED, ({ studentId }) => {
      setChatRequests((prev) => prev.filter((r) => r.studentId !== studentId));
    });

    // RECEIVE_MESSAGE
    sock.on(ChatEventEnum.RECEIVE_MESSAGE, ({ senderId, message }) => {
      setMessages((prev) => [...prev, { senderId, message }]);
    });

    // GET_MESSAGES
    sock.on(ChatEventEnum.GET_MESSAGES, (msgs: Message[]) => {
      setMessages(msgs);
    });

    // GET_REQUESTS
    sock.emit(ChatEventEnum.GET_REQUESTS);
    sock.on(ChatEventEnum.GET_REQUESTS, (requests: ChatRequest[]) => {
      setChatRequests(requests);
    });

    // CANCEL_REQUEST
    sock.on(ChatEventEnum.CANCEL_REQUEST, ({ studentId }) => {
      setChatRequests((prev) => prev.filter((r) => r.studentId !== studentId));
    });

    // LEAVE_ROOM
    sock.on(ChatEventEnum.LEAVE_ROOM, ({ leftRoomId }) => {
      console.log("Left room:", leftRoomId, roomId);
      // if (leftRoomId === roomId) {
      setRoomId(null);
      setMessages([]);
      sock.emit(ChatEventEnum.GET_REQUESTS);
      // }
    });

    // Cleanup
    return () => {
      // Remove listeners
      sock.removeAllListeners();
      disconnectSocket();
    };
  }, [user]); // Re-run when user changes

  if (!user) {
    return <div>Loading user...</div>;
  }

  // Utility booleans
  const isStudent = user.role === "student";
  const isVolunteer = Boolean(user.volunteer);
  const isAdmin = user.role === "admin";

  // Handlers
  const handleRequestChat = () => {
    if (!socket) {
      console.warn("Socket is not ready");
      return;
    }
    socket.emit(ChatEventEnum.STUDENT_REQUEST_CHAT);
    alert("Chat request sent. Please wait for a volunteer to accept.");
    const req: ChatRequest = {
      studentId: user.id,
      studentEmail: user.email,
      organizationId: user.organizationId,
    };
    setChatRequests([req]);
  };

  const handleAcceptChat = (studentId: string) => {
    if (!socket) return;
    socket.emit(ChatEventEnum.VOLUNTEER_ACCEPT_REQUEST, studentId);
    // Optionally remove the request from UI immediately
    setChatRequests((prev) => prev.filter((r) => r.studentId !== studentId));
  };

  const handleLeaveRoom = () => {
    if (!roomId || !socket) return;
    socket.emit(ChatEventEnum.LEAVE_ROOM, roomId);
    setRoomId(null);
    setMessages([]);
    socket.emit(ChatEventEnum.GET_REQUESTS);
  };

  const handleCancelRequest = () => {
    if (!socket) return;
    socket.emit(ChatEventEnum.CANCEL_REQUEST);
    setChatRequests([]);
    alert("Chat request cancelled.");
  };

  const handleSendMessage = () => {
    if (!socket) return;
    if (!roomId || messageInput.trim() === "") return;
    socket.emit(ChatEventEnum.SEND_MESSAGE, { roomId, message: messageInput });
    setMessages((prev) => [
      ...prev,
      { senderId: user.id, message: messageInput },
    ]);
    setMessageInput("");
  };

  // Render UI based on states
  return (
    <div style={{ padding: 24 }}>
      <h1>
        Chat Page — Role: {user.role} {isVolunteer && "(Volunteer)"}
      </h1>

      {/* If user is a student and not volunteer */}
      {isStudent && !isVolunteer && !roomId && (
        <div>
          {chatRequests.length > 0 ? (
            <Button onClick={handleCancelRequest}>Cancel Request</Button>
          ) : (
            <Button onClick={handleRequestChat}>Request Chat</Button>
          )}
        </div>
      )}

      {/* If user is volunteer (regardless of admin/student) and not in a room */}
      {isVolunteer && !roomId && (
        <div>
          <h3>Incoming Requests</h3>
          {chatRequests.length === 0 ? (
            <p>No requests yet</p>
          ) : (
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
          )}
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
              overflowY: "auto",
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
          <div style={{ marginTop: 8 }}>
            <input
              type="text"
              placeholder="Type your message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              style={{ width: "80%", marginRight: 8 }}
            />
            <Button onClick={handleSendMessage}>Send</Button>
            <Button onClick={handleLeaveRoom} style={{ marginLeft: 8 }}>
              Leave Chat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
