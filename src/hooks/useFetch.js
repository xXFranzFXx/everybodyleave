import { useCallback, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import useCalendar from './useCalendar';

const useFetch = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const { role, reminderDate, mongoId, name } = user;
  const { formatDateTime } = useCalendar();
  
    const saveCalendarReminder = async (data) => {
    const { year, month, day, time, intention, receiveText } = data;
    const dateString = `${year}-${month}-${day}`
    
    const dateTime = formatDateTime(dateString, time)
    const token = await getAccessTokenSilently();
    console.log('mongoId: ', mongoId);
    try {
        const response = await axios({
        method: 'POST',
        url: `http://localhost:4000/api/calendarReminders/saveReminder`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            mongoId: mongoId,
            phone: name,
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
            color: '#0000FF'
        },
        });
        const res = await response.data;
        return res;
    } catch (err) {
        console.log('Error saving calendar reminder: ', err);
    }
    };
    
    return {
        saveCalendarReminder

    }
}

export default useFetch;