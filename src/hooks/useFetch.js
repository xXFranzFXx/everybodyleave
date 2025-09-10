import { useCallback, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import useCalendar from './useCalendar';
const useFetch = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const { formatDateTime } = useCalendar();
  const [scheduledReminders, setScheduledReminders] = useState([]);

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
    console.log('mongoId: ', mongoId);
    try {
      const response = await axios({
        method: 'GET',
        url: `http://localhost:4000/api/events/getReminders`,
        // url: `https://everybodyleave.onrender.com/api/events/getReminders`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: `${mongoId}`,
        },
      });
      const reminders = await response.data;
      console.log('getReminders: ', reminders);
      setScheduledReminders(reminders);
      return reminders;
    } catch (err) {
      console.log('Error getting scheduled reminders: ', err);
    }
  };
  useEffect(() => {
    getScheduledReminders();
  }, []);

  return {
    saveCalendarReminder,
    scheduledReminders,
  };
};

export default useFetch;
