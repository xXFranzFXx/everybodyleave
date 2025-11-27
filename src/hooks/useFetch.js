import { useCallback, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import useCalendar from './useCalendar';
import { subscribe } from 'valtio';
import { useMetadataContext } from '../context/MetadataProvider';
import { useSocketContext } from '../context/SocketProvider';

const useFetch = () => { 
  const { saveUserReminder } = useMetadataContext();
  const { state } = useSocketContext();
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const { formatDateTime, formatReminder } = useCalendar();
  const [scheduledReminders, setScheduledReminders] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const saveCalendarReminder = useCallback(async (data) => {
    const { role, reminderDate, mongoId, name, profileName } = user;

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

const deleteCalendarReminder = useCallback(async (calendarDataId) => {
    const { role, reminderDate, mongoId, name } = user;

    const token = await getAccessTokenSilently();
    console.log('mongoId: ', mongoId);
    try {
      const response = await axios({
        method: 'PUT',
        // url: `http://localhost:4000/api/calendarReminders/deleteReminder`,
        url: `https://everybodyleave.onrender.com/api/calendarReminders/deleteReminder`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          mongoId: await mongoId,
          id: calendarDataId
        },
      });
      const res = await response.data;
      state.hasDeletedCalendar = true;
      return res;
    } catch (err) {
      console.log('Error deleting calendar reminder: ', err);
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
          if (state.hasCancelled === true) {
            getScheduledReminders();
          } else if (state.scheduledReminder === true) {
            getScheduledReminders();
            // state.scheduledReminder = false;
          }
          if ( state.hasSavedCalendar === true || state.hasDeletedCalendar === true) {
            getCalendarReminders();
          }
          // state.currentReminders = scheduledReminders.result;
          // console.log("currentReminders: ", state.currentReminders)
        };
        const unsubscribe = subscribe(state, callback);
        callback();
        return unsubscribe;
      }),
    []
  );
   const saveReminder = async (newDate, phone, timezone) => {
      const { mongoId, name, profileName } = user;

      const token = await getAccessTokenSilently();
      console.log('mongoId: ', mongoId);
      console.log("newDate: ", newDate)
      try {
        const response = await axios({
          method: 'POST',
          // url: `http://localhost:4000/api/events/save`,
          url: `https://everybodyleave.onrender.com/api/events/save`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            profileName: profileName,
            mongoId: mongoId,
            phone: phone,
            datetime: newDate,
            timezone: timezone,
          },
        });
        const reminder = await response.data;
        console.log('reminder date: ', reminder.date);
        console.log('reminder id: ', reminder.id);
        console.log('reminder: ', reminder)
        saveUserReminder(reminder.date);
        state.saveSuccess = true
        return reminder;
      } catch (err) {
        console.log('Error saving reminder: ', err);
      }
    };
  
  const sendVerificationSMS = async (phone, dateScheduled, intention) => {
    const { profileName, logins } = user;
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
          profileName: profileName,
          phone: phone,
          dateScheduled: formatReminder(dateScheduled),
          intention: intention,
          logins: logins,
        },
      });
      const res = await response.data;
      return res;
    } catch (err) {
      console.log('Error sending verification SMS: ', err);
    }
  };

   const sendCancellationSMS = async (phone, dateScheduled) => {
    const { profileName } = user;

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
          profileName: profileName,
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

  const createNudgeReminders = async (name, phone, intention, datetime, timezone) => {
     const token = await getAccessTokenSilently();

    try {
      const response = await axios({
        method: 'POST',
        // url: `http://localhost:4000/api/httpSms/nudgeTexts`,
        url: `https://everybodyleave.onrender.com/api/httpSms/nudgeTexts`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          name,
          phone,
          intention,
          datetime,
          timezone
        },
      });
      const res = await response.data;
      return res;
    } catch (err) {
      console.log('Error creating nudgeReminders ', err);
    }
  }


  //httpSms, this will send the first sms  in the morning of the leave
  const sendInitialSMS = async (timezone, phone, datetime, intention ) => {
    const { profileName, logins } = user;
    const token = await getAccessTokenSilently();
    try {
      const response = await axios({
        method: 'POST',
        // url: `http://localhost:4000/api//httpSms/initialSms`,
        url: `https://everybodyleave.onrender.com/api/httpSms/initialSms`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          profileName: profileName,
          phone: phone,
          dateScheduled: datetime,
          intention: intention,
          timezone: timezone
        },
      });
      const res = await response.data;
      return res;
    } catch (err) {
      console.log('Error sending verification SMS: ', err);
    }
  };

  //inngest 
  const createLeaveWorkflow = async( phone, datetime, timezone, intention) => {
   const { profileName, logins, mongoId } = user;
    const token = await getAccessTokenSilently();
    try {
      const response = await axios({
        method: 'POST',
        // url: `http://localhost:4000/api//httpSms/initialSms`,
        url: `https://everybodyleave.onrender.com/api/inngestWorkflows/createLeave`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          profileName: profileName,
          phone: phone,
          dateScheduled: datetime,
          intention: intention,
          timezone: timezone, 
          logins: logins,

        },
      });
      const res = await response.data;
      return res;
    } catch (err) {
      console.log('Error creating inngest workflow: ', err);
    }
  }
  return {
    saveReminder,
    sendVerificationSMS,
    sendCancellationSMS,
    saveCalendarReminder,
    deleteCalendarReminder,
    createNudgeReminders,
    sendInitialSMS,
    createLeaveWorkflow,
    scheduledReminders,
    calendarData,
  };
};

export default useFetch;
