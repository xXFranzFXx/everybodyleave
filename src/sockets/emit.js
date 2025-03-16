import { socket } from "./index";

export const getNotifications = () => {
    socket.emit('notificationsToSocket');
  };

export const scheduleNotification = (data) => {
  socket.emit('scheduleTwilioSmsNotification', data)
}

export const sms46Elks = (data) => {
  const { phone } = data;
  socket.emit('send46ElksSms', phone)
}