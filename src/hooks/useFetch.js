import { useCallback, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import useCalendar from './useCalendar';
import { subscribe } from 'valtio';
import { useSocketContext } from '../context/SocketProvider';
const useFetch = () => {
  const { state } = useSocketContext();
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const { formatDateTime, formatReminder } = useCalendar();
  const [scheduledReminders, setScheduledReminders] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const saveCalendarReminder = useCallback(async (data) => {
    const { role, reminderDate, mongoId, name } = user;

    const { year, month, day, time, intention, receiveText } = data;
    const dateString = `${year}-${month}-${day}`;

    const dateTime = formatDateTime(dateString, time);
    const token = await getAccessTokenSilently();
    console.log('mongoId: ', mongoId);
    try {
      const response = await axios({
        method: 'POST',
        // url: `http://localhost:4000/api/calendarReminders/saveReminder`,
        url: `https://everybodyleave.onrender.com/api/calendarReminders/saveReminder`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          mongoId: await mongoId,
          phone: await name,
          datetime: new Date(dateTime),
          //   timezone: timezone,
          intention: intention,
          time: time,
          day: day,
          month: month,
          year: year,
          receiveText: receiveText,
          status: 'upcoming',
          completed: false,
          color: '#0000FF',
        },
      });
      const res = await response.data;
      return res;
    } catch (err) {
      console.log('Error saving calendar reminder: ', err);
    }
  }, []);

  const getScheduledReminders = async () => {
    const { mongoId } = user;

    const token = await getAccessTokenSilently();
    // console.log('mongoId: ', mongoId);
    try {
      const response = await axios({
        method: 'GET',
        // url: `http://localhost:4000/api/events/getReminders`,
        url: `https://everybodyleave.onrender.com/api/events/getReminders`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: await mongoId,
        },
      });
      let reminders = [];
      reminders = await response.data;
      setScheduledReminders(reminders);
      return reminders;
    } catch (err) {
      console.log('Error getting scheduled reminders: ', err);
    }
  };
  const getCalendarReminders = async () => {
    const { mongoId } = user;

    const token = await getAccessTokenSilently();

    try {
      const response = await axios({
        method: 'GET',
        //   url: `http://localhost:4000/api/calendarReminders/getReminders`,
        url: `https://everybodyleave.onrender.com/api/calendarReminders/getReminders`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: await mongoId,
        },
      });
      let calendarReminders = [];
      calendarReminders = await response.data.result;
      setCalendarData(calendarReminders);
      return calendarReminders;
    } catch (err) {
      console.log('Error saving calendar reminder: ', err);
    }
  };
  useEffect(() => {
    getScheduledReminders();
    getCalendarReminders();
  }, []);

  //subscribe to state, when event is cancelled, fetch the user's scheduled events so
  //the cancelled event will be available to choose again from the datetimepicker component
  useEffect(
    () =>
      subscribe(state, () => {
        const callback = () => {
          if (state.hasCancelled) {
            getScheduledReminders();
          } else if (state.scheduledReminder) {
            getScheduledReminders();
            // state.scheduledReminder = false;
          }
          if ( state.hasSavedCalendar === true) {
            getCalendarReminders();
          }
          
          state.currentReminders = scheduledReminders.result;
          console.log("currentReminders: ", state.currentReminders)
        };
        const unsubscribe = subscribe(state, callback);
        callback();
        return unsubscribe;
      }),
    []
  );

  const sendVerificationSMS = async (phone, dateScheduled) => {
    const token = await getAccessTokenSilently();

    try {
      const response = await axios({
        method: 'POST',
        // url: `http://localhost:4000/api/textBee/verificationSMS`,
        url: `https://everybodyleave.onrender.com/api/textBee/verificationSMS`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          phone: phone,
          dateScheduled: formatReminder(dateScheduled),
        },
      });
      const res = await response.data;
      return res;
    } catch (err) {
      console.log('Error sending verification SMS: ', err);
    }
  };

   const sendCancellationSMS = async (phone, dateScheduled) => {
    const token = await getAccessTokenSilently();

    try {
      const response = await axios({
        method: 'POST',
        // url: `http://localhost:4000/api/textBee/cancellationSMS`,
        url: `https://everybodyleave.onrender.com/api/textBee/cancellationSMS`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          phone: phone,
          dateScheduled: formatReminder(dateScheduled),
        },
      });
      const res = await response.data;
      return res;
    } catch (err) {
      console.log('Error sending cancellation SMS: ', err);
    }
  };
  return {
    sendVerificationSMS,
    sendCancellationSMS,
    saveCalendarReminder,
    scheduledReminders,
    calendarData,
  };
};

export default useFetch;
