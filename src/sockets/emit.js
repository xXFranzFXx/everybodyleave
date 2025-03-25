import { socket } from "./index";

export const getNotifications = () => {
    socket.emit('notificationsToSocket');
  };

export const twilioSms = (data) => {
  socket.emit('sendTwilioSms', data);
}

export const textBeeSms = (data) =>{
  socket.emit('sendTextBeeSms', data);
}

export const sms46Elks = (data) => {
  socket.emit('send46ElksSms', data, 'dryrun');
}