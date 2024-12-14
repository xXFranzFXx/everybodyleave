import { socket } from "./index";

export const getNotifications = () => {
    socket.emit('notificationsToSocket');
  };