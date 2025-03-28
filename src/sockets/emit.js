import { socket } from "./index";

export const getNotifications = () => {
    socket.emit('notificationsToSocket');
  };

export const twilioVoice = (data) => {
  socket.emit('sendTwilioSms', data);
}

export const textBeeSms = (data) =>{
  socket.emit('sendTextBeeSms', data);
}
export const cronTextBeeSms = (data) => {
  socket.emit('sendTextBeeCronSms', data)
}
export const emailReminder = (data) => {
  socket.emit('sendEmailReminder', data);
}
export const sms46Elks = (data) => {
  socket.emit('send46ElksSms', data, 'dryrun');
}