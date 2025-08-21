import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import dayjs from 'dayjs';
import { format } from "date-fns";

const useGetDates = () => {
  const [events, setEvents] = useState([]);
  const [latestTime, setLatestTime] = useState("");
  const [scheduled, setScheduled] = useState([]);
  const { getAccessTokenSilently, user } = useAuth0();
  const [times, setTimes] = useState([]);
  const [dates, setDates] = useState([]);


  const getEvents = async () => {
              try {
                const response = await axios({
                        method: 'GET',
                        url: `http://localhost:4000/api/events/allDates`
                    })
                    const res = await response.data;
                    setEvents(res.cursor)
                    return res.cursor;
                  } catch (err) {
                    console.log("Error retrieving dates: ", err)
                  }
      }
 const getLatestTime = async () => {
              try {
                const response = await axios({
                        method: 'GET',
                        url: `http://localhost:4000/api/events/latestTime`,
      
                    })
                    const res = await response.data;
                    setLatestTime(res.cursor[0].latest_date)
                    return res.cursor[0].latest_date;
                  } catch (err) {
                    console.log("Error retrieving dates: ", err)
                  }
      }
  const getScheduledReminders = async () => {
    try {
      const token = await getAccessTokenSilently();
      const { mongoId } = user;
      const response = await axios({
        method: 'GET',
        url: `http://localhost:4000/api/events/getReminders`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: {
          mongoId: mongoId
        }
      })
       const res = await response.data;
                    setScheduled(res.cursor[0].eventDates)
                    return res.cursor[0].eventDates;
                  } catch (err) {
                    console.log("Error retrieving schedule: ", err)
                  }
    }


  useEffect(() => {
    getEvents();
    getLatestTime();
    // getScheduledReminders();
  },[]) 

   useEffect(() => {
      const hours = events?.map(event => dayjs(event.date).hour());
      const hourSet = new Set(hours);
      setTimes(Array.from(hourSet));

      const dates = events?.map(event => format(event.date, 'yyyy-MM-dd'))
      const dateSet = new Set(dates)
      setDates(Array.from(dateSet));

    },[events])

  return {
    events,
    latestTime,
    dates,
    // scheduled,
    times
  }
}

export default useGetDates;