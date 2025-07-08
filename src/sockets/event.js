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
    })

    socket.on('sms otp verification', ({ otp_sms }) => {
      return { ...state, otp_sms };
    })
    socket.on('created reminder', ({ reminder }) => {
      // const { saveUserReminder } = useMetadataContext();
      // saveUserReminder(reminder);
      return { ...state, reminder }
    })
    socket.on('reminder cancelled', ({ date }) => {
      state.reminder.filter(event => event != date);
      return { ...state };
    })
}