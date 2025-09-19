import { ChatEventEnum } from '../constants';
import { Server } from 'socket.io';
import { IApiSocket } from '../types';
import { socketAuthMiddleware } from '../middleware/socket_auth_middleware';
import { db } from '../db';
import {
  chatMessages as chatMessagesSchema,
  chatRequests as chatRequestsSchema,
  chatSessions as chatSessionsSchema,
} from '../db/schema';
import { eq } from 'drizzle-orm';

const mountChatEvent = (socket: IApiSocket) => {
  const user = socket.user;
  if (!user) return;

  if (!user.volunteer) {
    socket.on(ChatEventEnum.STUDENT_REQUEST_CHAT, async () => {
      //check if already pending
      const existing = await db.query.chatRequests.findFirst({
        where: (cr, { eq, and }) =>
          and(eq(cr.studentId, user.id), eq(cr.status, 'pending')),
      });
      if (existing) return;
      await db
        .insert(chatRequestsSchema)
        .values({
          studentId: user.id,
          status: 'pending',
        })
        .returning();
      socket.broadcast.emit(ChatEventEnum.NEW_CHAT_REQUEST, {
        studentId: user.id,
        studentEmail: user.email,
      });
    });
  }

  if (user.volunteer) {
    socket.on(
      ChatEventEnum.VOLUNTEER_ACCEPT_REQUEST,
      async (studentId: string) => {
        const request = await db.query.chatRequests.findFirst({
          where: (cr, { eq, and }) =>
            and(eq(cr.studentId, studentId), eq(cr.status, 'pending')),
        });
        if (!request)
          return socket.emit(
            ChatEventEnum.ERROR_EVENT,
            'Request not found or already accepted',
          );
        await db
          .update(chatRequestsSchema)
          .set({
            status: 'accepted',
          })
          .where(eq(chatRequestsSchema.id, request.id));

        const [session] = await db
          .insert(chatSessionsSchema)
          .values({
            studentId: studentId,
            volunteerId: user.id,
          })
          .returning();
        const roomId = session.id;
        socket.join(roomId);

        //notify student
        socket.to(studentId).emit(ChatEventEnum.START_CHAT, {
          roomId,
          sessionId: session.id,
          volunteer: {
            id: user.id,
            email: user.email,
          },
        });
        //notify volunteer
        socket.emit(ChatEventEnum.START_CHAT, {
          roomId,
          sessionId: session.id,
          studentId,
        });
      },
    );
  }

  // send message
  socket.on(ChatEventEnum.SEND_MESSAGE, async ({ roomId, message }) => {
    const senderId = socket.user?.id;
    console.log(roomId, message);
    await db
      .insert(chatMessagesSchema)
      .values({
        chatSessionId: roomId,
        senderId: senderId!,
        message,
      })
      .returning();
    socket.to(roomId).emit(ChatEventEnum.RECEIVE_MESSAGE, {
      roomId,
      message,
      senderId,
    });
  });
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${user.email}`);
  });
  socket.on(ChatEventEnum.JOIN_ROOM, (roomId: string) => {
    socket.join(roomId);
  });
};

const initializeSocketIo = (io: Server) => {
  io.use(socketAuthMiddleware);
  io.on('connection', async (socket: IApiSocket) => {
    const user = socket.user;
    console.log(`✅ User connected via socket: ${user?.id}`);
    if (!user) return;
    console.log(`User connected: ${user.email}`);
    socket.join(user.id.toString());

    mountChatEvent(socket);
  });
};
export { initializeSocketIo };
