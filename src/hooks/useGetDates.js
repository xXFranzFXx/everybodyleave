import React, { useState, useEffect } from 'react';
import axios from 'axios';
const useGetDates = () => {
  const [events, setEvents] = useState([]);
  const [latestTime, setLatestTime] = useState("")
  const getEvents = async () => {
              try {
                const response = await axios({
                        method: 'GET',
                        url: `http://localhost:4000/api/events/allDates`,
      
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

  useEffect(() => {
    getEvents();
    getLatestTime();
  },[]) 

  return {
    events,
    latestTime
  }
}

export default useGetDates;