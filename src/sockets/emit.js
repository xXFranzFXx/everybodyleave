import { socket } from './index';

export const getEvents = (mongoId) => {
  socket.emit('getEvents', mongoId);
};

export const scheduledNotifications = (data) => {
  socket.emit('scheduledReminders', data);
};

export const twilioVoice = (data) => {
  socket.emit('sendTwilioSms', data);
};

export const smsVerification = (data) => {
  socket.emit('sendSMSVerification', data);
};

export const cronTextBeeSms = (data) => {
  socket.emit('sendTextBeeCronSms', data);
};

export const emailReminder = (data) => {
  socket.emit('sendEmailReminder', data);
};

export const createNudgeReminders = (data) => {
  socket.emit('createNudgeReminders', data);
};

export const userMetadata = (data) => {
  socket.emit('userMetadata', data);
};
