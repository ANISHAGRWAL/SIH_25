export const TMP_ATTACHMENT_UPLOAD_DIR = '/tmp/Campus Care/uploads';

export enum ChatEventEnum {
  STUDENT_REQUEST_CHAT = 'student_request_chat',
  NEW_CHAT_REQUEST = 'new_chat_request',
  VOLUNTEER_ACCEPT_REQUEST = 'volunteer_accept_request',
  START_CHAT = 'start_chat',
  SEND_MESSAGE = 'send_message',
  RECEIVE_MESSAGE = 'receive_message',
  ERROR_EVENT = 'error_event',
  JOIN_ROOM = 'join_room',
}
