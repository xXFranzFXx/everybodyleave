import { socket } from './index';
// import { useMetadataContext } from '../context/MetadataProvider';
export const socketEvents = ({ state }) => {
  
  socket.on('notifications', ({ notifications }) => {
    return { ...state, notifications };
  });

  socket.on('textBeeSms', ({ job }) => {
    return { ...state, job };
  });

  socket.on('email otp verification', ({ otp_email }) => {
    return { ...state, otp_email };
  });

  socket.on('sms otp verification', ({ otp_sms }) => {
    return { ...state, otp_sms };
  });

  socket.on('created reminder', ({ reminder }) => {
    // const { saveUserReminder } = useMetadataContext();
    // saveUserReminder(reminder);

    console.log('socket reminder: ', reminder);
    let currentState = { ...state };
    currentState.currentReminder = reminder;
    currentState.scheduledReminder = true;
    console.log('currentState.currentReminder: ', currentState.currentReminder);

    return {...state };
  });

  socket.on('reminder cancelled', ({ date }) => {
    console.log('state: ', state);
    let reminders = state.reminders;
    if (Array.isArray(state.reminders) && reminders.includes(date)) {
      reminders.filter((event) => event !== date);
      return { ...state };
    } else {
      state.currentReminder = '';
      state.scheduledReminder = false;
    }
    return { ...state };
  });

  socket.on('scheduledReminders', ({ scheduledReminders }) => {
    console.log('socket context reminders: ', scheduledReminders);
    const currentState = { ...state };
    currentState.reminders = [...scheduledReminders];
    return { state: currentState };
  });
};

