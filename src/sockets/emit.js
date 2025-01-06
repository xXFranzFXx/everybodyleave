import { socket } from "./index";

export const getNotifications = () => {
    socket.emit('notificationsToSocket');
  };

export const scheduleNotification = (data) => {
  socket.emit('scheduleNotification', data)
}