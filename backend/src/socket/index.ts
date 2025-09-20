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
import { and, eq, or } from 'drizzle-orm';

const mountChatEvent = (socket: IApiSocket) => {
  const user = socket.user;
  if (!user) return;

  //student
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
          organizationId: user.organizationId,
        })
        .returning();
      socket.broadcast.emit(ChatEventEnum.NEW_CHAT_REQUEST, {
        studentId: user.id,
        studentEmail: user.email,
        organizationId: user.organizationId,
      });
    });

    socket.on(ChatEventEnum.GET_REQUESTS, async () => {
      const requests = await db.query.chatRequests.findMany({
        where: (cr, { and, eq }) =>
          and(eq(cr.studentId, user.id), eq(cr.status, 'pending')),
        orderBy: (cr, { desc }) => [desc(cr.createdAt)],
        columns: {
          studentId: true,
        },
        with: {
          student: {
            columns: {
              email: true,
            },
          },
        },
      });
      const response = requests.map((r) => ({
        studentId: r.studentId,
        studentEmail: r.student.email,
      }));
      socket.emit(ChatEventEnum.GET_REQUESTS, response);
    });

    socket.on(ChatEventEnum.CANCEL_REQUEST, async () => {
      await db
        .delete(chatRequestsSchema)
        .where(and(eq(chatRequestsSchema.studentId, user.id)));
      //inform the volunteer that one cancelled the request
      socket.broadcast.emit(ChatEventEnum.CANCEL_REQUEST, {
        studentId: user.id,
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
        //notify all volunteers to remove the request from their list
        socket.broadcast.emit(ChatEventEnum.REQUEST_ACCEPTED, {
          studentId,
          organizationId: user.organizationId,
        });
      },
    );

    socket.on(ChatEventEnum.GET_REQUESTS, async () => {
      const requests = await db.query.chatRequests.findMany({
        where: (cr, { and, eq }) =>
          and(
            eq(cr.status, 'pending'),
            eq(cr.organizationId, user.organizationId),
          ),
        orderBy: (cr, { desc }) => [desc(cr.createdAt)],
        columns: {
          studentId: true,
        },
        with: {
          student: {
            columns: {
              email: true,
            },
          },
        },
      });
      const response = requests.map((r) => ({
        studentId: r.studentId,
        studentEmail: r.student.email,
      }));
      socket.emit(ChatEventEnum.GET_REQUESTS, response);
    });
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

  socket.on(ChatEventEnum.GET_MESSAGES, async (roomId: string) => {
    const messages = await db.query.chatMessages.findMany({
      where: eq(chatMessagesSchema.chatSessionId, roomId),
      orderBy: (cm, { asc }) => [asc(cm.sentAt)],
      columns: {
        senderId: true,
        message: true,
      },
    });
    socket.emit(ChatEventEnum.GET_MESSAGES, messages);
  });

  socket.on(ChatEventEnum.LEAVE_ROOM, async (roomId: string) => {
    // Get the session info to know both users
    const session = await db.query.chatSessions.findFirst({
      where: eq(chatSessionsSchema.id, roomId),
    });

    await db.transaction(async (tx) => {
      await tx
        .delete(chatMessagesSchema)
        .where(eq(chatMessagesSchema.chatSessionId, roomId));
      await tx
        .delete(chatSessionsSchema)
        .where(eq(chatSessionsSchema.id, roomId));
      await tx
        .delete(chatRequestsSchema)
        .where(eq(chatRequestsSchema.studentId, user.id));
    });

    socket.leave(roomId);

    // Notify both users: current and the other party
    if (session) {
      const otherUserId =
        user.id === session.studentId ? session.volunteerId : session.studentId;

      // Send to the other user
      socket.to(otherUserId.toString()).emit(ChatEventEnum.LEAVE_ROOM, {
        leftRoomId: roomId,
      });
    }

    // Send to self
    socket.emit(ChatEventEnum.LEAVE_ROOM, {
      leftRoomId: roomId,
    });
  });

  socket.on(ChatEventEnum.GET_ACTIVE_ROOM, async () => {
    const session = await db.query.chatSessions.findFirst({
      where: or(
        eq(chatSessionsSchema.studentId, user.id),
        eq(chatSessionsSchema.volunteerId, user.id),
      ),
    });
    if (session) {
      socket.emit(ChatEventEnum.GET_ACTIVE_ROOM, { savedRoomId: session.id });
    } else {
      socket.emit(ChatEventEnum.GET_ACTIVE_ROOM, { savedRoomId: null });
    }
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
