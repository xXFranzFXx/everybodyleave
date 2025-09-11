import { socket } from "./index";

export const getNotifications = () => {
    socket.emit('notificationsToSocket');
  };
export const scheduledNotifications = (data) => {
  socket.emit('scheduledReminders', (data))
}
export const twilioVoice = (data) => {
  socket.emit('sendTwilioSms', data);
}

export const smsVerification = (data) =>{
  socket.emit('sendSMSVerification', data);
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

export const userMetadata = (data) => {
  socket.emit('userMetadata', data)
}