import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'; 
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { format } from 'date-fns';
dayjs.extend(isSameOrBefore);


  export const CalendarContext = createContext();
  const CalendarProvider = ({ children }) => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [events, setEvents] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [latestTime, setLatestTime] = useState('');
  const [scheduled, setScheduled] = useState([]);
  const [times, setTimes] = useState([]);
  const [dates, setDates] = useState([]);
  const [daysOfMonth, setDaysOfMonth] = useState([]);
  const [availableDT, setAvailableDT] = useState([]);
  const [radioOptions, setRadioOptions] = useState([]);
  const [dtMap, setDtMap] = useState(new Map());
  const [simpleDtMap, setSimpleDtMap] = useState(new Map());
  const now = dayjs();

  const getEvents = async () => {
    try {
      const response = await axios({
        method: 'GET',
        // url: `http://localhost:4000/api/events/allDates`,
        url: `https://everybodyleave.onrender.com/api/events/allDates`,
      });
      const res = await response.data;
      setEvents(res.cursor);
      const result = await res.cursor;
      const hours = await result?.map((event) => dayjs(event.date).hour());
      const hourSet = new Set(hours);
      setTimes(Array.from(hourSet));
      // events.forEach(event => {
      //   console.log("dayjs(event.date): ", dayjs(event.date).date())
      // })
      const available = await result.filter(
        (event) =>  now.isBefore(dayjs(event.date)) 
      );
      setAvailableDT(available);
      console.log('available: ', available);
      const dates = await result?.map((event) => format(event.date, 'yyyy-MM-dd'));
      const dateSet = new Set(dates);
      setDates(Array.from(dateSet));
      const dateTimeMap = new Map();
      const days = await available.map((event) => dayjs(event.date).date());
      const daysSet = new Set(days);
      const dotm = Array.from(daysSet);
      setDaysOfMonth(dotm);
      // console.log('daysOfMonth: ', dotm);
      await available.forEach((event) => {
        dateTimeMap.set(dayjs(event.date).format('YYYY-MM-DD'), []);
      });
      const dayTMap = new Map();
      dotm.forEach((day) => {
        dayTMap.set(day, [])
        })
      await available.forEach((event) => {
        const simpleKey = dayjs(event.date).date();
        const key = dayjs(event.date).format('YYYY-MM-DD');
        const time = dayjs(event.date).hour();
        dateTimeMap.get(key).push(time);
        dayTMap.get(simpleKey).push(time);
      });
      setSimpleDtMap(dayTMap);
      setDtMap(dateTimeMap);
      console.log('dateTimeMap: ', dateTimeMap);

     
      return { dateSet, daysSet, dateTimeMap, hourSet, dotm };
    } catch (err) {
      console.log('Error retrieving dates: ', err);
    }
  };

   const getCalendarReminders = async () => {
    const token = await getAccessTokenSilently();
    const name =  user?.name;
    try {
        const response = await axios({
        method: 'GET',
        // url: `http://localhost:4000/api/calendarReminders/getReminders`,
        url: `https://everybodyleave.onrender.com/api/calendarReminders/getReminders`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            phone: name
        },
        });
        const calendarReminders = await response.data;
        console.log("calendar reminders: ", calendarReminders.result)
        setCalendarData(calendarReminders.result)
        return calendarReminders;
    } catch (err) {
        console.log('Error saving calendar reminder: ', err);
    }
    };
    
  useEffect(() => {
    getEvents();
    getCalendarReminders();
    // getLatestTime();
    // getScheduledReminders();
  }, []);
  const getLatestTime = async () => {
    try {
      const response = await axios({
        method: 'GET',
        // url: `http://localhost:4000/api/events/latestTime`,
        url: `https://everybodyleave.onrender.com/api/events/latestTime`,
      });
      const res = await response.data;
      setLatestTime(res.cursor[0].latest_date);
      return res.cursor[0].latest_date;
    } catch (err) {
      console.log('Error retrieving dates: ', err);
    }
  };

  const getScheduledReminders = async () => {
    try {
      const token = await getAccessTokenSilently();
      const { mongoId } = user;
      const response = await axios({
        method: 'GET',
        // url: `http://localhost:4000/api/events/getReminders`,
       url:`https://everybodyleave.onrender.com/api/events/getReminders`,

        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          mongoId: mongoId,
        },
      });
      const res = await response.data;
      setScheduled(res.cursor[0].eventDates);
      return res.cursor[0].eventDates;
    } catch (err) {
      console.log('Error retrieving schedule: ', err);
    }
  };

 
  const getTimes = useCallback(async (day, month, year) => {
       const times = await dtMap?.get(`${year}-${month}-${day}`);
       setRadioOptions(times)
       return times;
    },[])

 

  

    return ( 
      <CalendarContext.Provider value={{
            events,
            latestTime,
            scheduled,
            times,
            dates,
            daysOfMonth,
            availableDT,
            dtMap,
            simpleDtMap,
            calendarData,
            getTimes
        }}
      >
        {children}
      </CalendarContext.Provider>
    )
  }
export function useCalendarContext() {
  const { events,
            latestTime,
            scheduled,
            times,
            dates,
            daysOfMonth,
            availableDT,
            getTimes,
            dtMap,
            simpleDtMap,
            calendarData
             } = useContext(CalendarContext)
  return { events,
            latestTime,
            scheduled,
            times,
            dates,
            daysOfMonth,
            availableDT,
            getTimes,
            dtMap,
            simpleDtMap, 
            calendarData };
}
export default CalendarProvider;