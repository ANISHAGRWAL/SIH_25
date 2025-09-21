"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Send,
  Bell,
  UserCheck,
  LoaderCircle,
  LogOut,
  Lock,
} from "lucide-react";

import { ChatEventEnum } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { connectSocket, disconnectSocket } from "@/sockets/socket";

// Types
type Message = {
  senderId: string;
  message: string;
};

type ChatRequest = {
  studentId: string;
  studentEmail: string;
  organizationId?: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Socket Connection
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const sock = connectSocket(token);
    socketRef.current = sock;
    setSocket(sock);

    sock.on(ChatEventEnum.CONNECTED_EVENT, () =>
      console.log("Socket connected")
    );

    sock.emit(ChatEventEnum.GET_ACTIVE_ROOM);
    sock.on(ChatEventEnum.GET_ACTIVE_ROOM, ({ savedRoomId }) => {
      if (savedRoomId) {
        setRoomId(savedRoomId);
        sock.emit(ChatEventEnum.JOIN_ROOM, savedRoomId);
        sock.emit(ChatEventEnum.GET_MESSAGES, savedRoomId);
      }
    });

    sock.on(ChatEventEnum.START_CHAT, ({ roomId: newRoomId }) => {
      sock.emit(ChatEventEnum.JOIN_ROOM, newRoomId);
      setRoomId(newRoomId);
      setMessages([]);
      sock.emit(ChatEventEnum.GET_MESSAGES, newRoomId);
    });

    sock.on(ChatEventEnum.NEW_CHAT_REQUEST, (req: ChatRequest) => {
      if (
        req.organizationId &&
        user.organizationId &&
        req.organizationId !== user.organizationId
      ) {
        return;
      }
      if (user.volunteer) {
        setChatRequests((prev) =>
          prev.some((r) => r.studentId === req.studentId)
            ? prev
            : [...prev, req]
        );
      }
    });

    sock.on(ChatEventEnum.REQUEST_ACCEPTED, ({ studentId }) =>
      setChatRequests((prev) => prev.filter((r) => r.studentId !== studentId))
    );

    sock.on(ChatEventEnum.RECEIVE_MESSAGE, ({ senderId, message }) =>
      setMessages((prev) => [...prev, { senderId, message }])
    );

    sock.on(ChatEventEnum.GET_MESSAGES, (msgs: Message[]) => setMessages(msgs));

    sock.emit(ChatEventEnum.GET_REQUESTS);
    sock.on(ChatEventEnum.GET_REQUESTS, (requests: ChatRequest[]) =>
      setChatRequests(requests)
    );

    sock.on(ChatEventEnum.CANCEL_REQUEST, ({ studentId }) =>
      setChatRequests((prev) => prev.filter((r) => r.studentId !== studentId))
    );

    sock.on(ChatEventEnum.LEAVE_ROOM, () => {
      setRoomId(null);
      setMessages([]);
      sock.emit(ChatEventEnum.GET_REQUESTS);
    });

    return () => {
      sock.removeAllListeners();
      disconnectSocket();
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  const isStudent = user.role === "student";
  const isVolunteer = Boolean(user.volunteer);

  const handleSendMessage = () => {
    if (!socket || !roomId || messageInput.trim() === "") return;
    socket.emit(ChatEventEnum.SEND_MESSAGE, { roomId, message: messageInput });
    setMessages((prev) => [
      ...prev,
      { senderId: user.id, message: messageInput },
    ]);
    setMessageInput("");
  };

  const handleRequestChat = () => {
    if (!socket) return;
    socket.emit(ChatEventEnum.STUDENT_REQUEST_CHAT);
    alert("Chat request sent. Please wait for a volunteer.");
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

  return (
    <div className="h-screen w-full bg-gradient-to-b from-sky-100 to-blue-50 flex flex-col">
      <div className="w-full p-4 flex-1 flex flex-col min-h-0">
        <header className="mb-4 shrink-0">
          <h1 className="text-3xl font-bold text-slate-800">Chat Support</h1>
          <p className="text-sm text-slate-600">
            Role: <span className="font-semibold capitalize">{user.role}</span>
            {isVolunteer && (
              <span className="text-slate-700"> (Volunteer)</span>
            )}
          </p>
        </header>

        <main className="flex-1 flex flex-col min-h-0">
          {roomId ? (
            <Card className="flex-1 flex flex-col min-h-0">
              <CardHeader className="border-b bg-slate-50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-slate-600" />
                  <div>
                    <CardTitle className="text-lg text-slate-700">
                      Secure Chat Room
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-green-700">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      Connected
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLeaveRoom}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Leave Chat
                </Button>
              </CardHeader>

              <CardContent className="flex-1 p-4 overflow-y-auto bg-white">
                {messages.map((msg, index) => {
                  const isSender = msg.senderId === user.id;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        isSender ? "items-end" : "items-start"
                      } mb-2`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md rounded-lg px-3 py-2 ${
                          isSender
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-slate-200 text-slate-800 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </CardContent>

              <CardFooter className="p-4 border-t bg-slate-50">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <>
              {isStudent && !isVolunteer && (
                <Card className="text-center p-6 shadow bg-white">
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chatRequests.length > 0 ? (
                      <div className="flex flex-col items-center gap-4">
                        <LoaderCircle className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="text-slate-600">
                          Waiting for a volunteer...
                        </p>
                        <Button variant="outline" onClick={handleCancelRequest}>
                          Cancel Request
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <p className="text-slate-600">
                          Click below to request a chat.
                        </p>
                        <Button onClick={handleRequestChat}>
                          Request Chat
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {isVolunteer && (
                <Card className="shadow bg-white">
                  <CardHeader>
                    <CardTitle>Incoming Chat Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chatRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="mx-auto h-10 w-10 text-slate-400" />
                        <p className="mt-2 text-sm text-slate-600">
                          No requests yet.
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y">
                        {chatRequests.map((req) => (
                          <li
                            key={req.studentId}
                            className="flex justify-between items-center py-2"
                          >
                            <span className="text-sm text-slate-700">
                              {req.studentEmail}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptChat(req.studentId)}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Accept
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
