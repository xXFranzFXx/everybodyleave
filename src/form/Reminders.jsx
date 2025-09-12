import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocketContext } from '../context/SocketProvider';
import { useMetadataContext } from '../context/MetadataProvider';
import dayjs from 'dayjs'
import useFetch from '../hooks/useFetch';
import axios from 'axios';
import { subscribe, useSnapshot } from 'valtio';
import useCalendar from '../hooks/useCalendar';
import { Typography, Button, Grid2, Box } from '@mui/material';
import { useCalendarContext } from '../context/CalendarProvider';
export const Reminders = ({ dateScheduled }) => {
  // const { reminders } = useMetadataContext();
  const { isBeforeNow, formatReminder } = useCalendar();
  const { scheduledReminders } = useFetch();
  const { state } = useSocketContext();
  const { events } = useCalendarContext();
  let eventDates = [];
  eventDates = events.filter(event => !isBeforeNow( dayjs(event.date).date()))
  // const { snap } = useSnapshot(state);
  const { phone, timezone } = state;
  const { user, getAccessTokenSilently } = useAuth0();
  const { reminderDate, mongoId } = user;
  const [displayedDate, setDisplayedDate] = useState([]);
  const [pastReminders, setPastReminders] = useState([]);
  const [hasCancelled, setHasCancelled] = useState("");
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  useEffect(() => {
    if(dateScheduled) {
      let upcoming = [...upcomingReminders];
      upcoming = [...upcoming, dateScheduled];
      setUpcomingReminders(upcoming);
    }
  },[dateScheduled]);

  const handleDeleteDate = useCallback((date) => {
      setUpcomingReminders(upcomingReminders.filter((dates) => dates !== date)); 
      state.hasCancelled = date  
  },[])
 
  const onDelete = async (date) => {
    const token = await getAccessTokenSilently();

    console.log('mongoId: ', mongoId);
    try {
      const response = await axios({
        method: 'PUT',
        // url: `http://localhost:4000/api/events/remove`,
        url: `https://everybodyleave.onrender.com/api/events/cancel`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          mongoId: mongoId,
          phone: phone,
          datetime: new Date(date),
          timezone: timezone,
        },
      });
      const res = await response.data;
      handleDeleteDate(date)
     
      return res;
    } catch (err) {
      console.log('Error cancelling reminder: ', err);
    }
  };
  useEffect(() => {
    let past = [];
    let current = [];
    let scheduled = scheduledReminders.result;
    scheduled?.forEach((reminder) => {
      if (isBeforeNow(reminder)) {
        past.push(reminder);
      } else {
        current.push(reminder);
      }
      setPastReminders(past);
      setUpcomingReminders(current);
    });
  }, [scheduledReminders]);
  const onEdit = () => {};

  useEffect(
    () =>
      subscribe(state, () => {
        const callback = () => {
          let past = [];
          let current = [];
          if (state.reminders.length) {
            state.reminders?.forEach((reminder) => {
              if (isBeforeNow(reminder)) {
                past.push(reminder);
              } else {
                current.push(reminder);
              }
              setPastReminders(past);
              setUpcomingReminders(current);
            });
            if (state.currentReminder) {
              // conditionally update local state
              let newDate = [...displayedDate, state.reminder];
              setDisplayedDate(state.currentReminder);
            }
          }
        };
        const unsubscribe = subscribe(state, callback);
        callback();
        return unsubscribe;
      }),
    []
  );

  return (
    <>
      <Box xs={12} md={6} px={1} py={1} sx={{ width: '100%', p: 1 }}>
        {Array.isArray(displayedDate) &&
          displayedDate.map((date, idx) => (
            <>
              <Grid2 container spacing={{ xs: 2, md: 3 }}>
                <Grid2 key={idx} item size={12} sx={{ width: 'auto' }}>
                  <Typography variant="h7">{formatReminder(date)}</Typography>
                </Grid2>
                {displayedDate && !isBeforeNow(date) && (
                  <Box mt={3}>
                    <Button variant="contained" color="primary" onClick={onDelete}>
                     Cancel
                    </Button>
                  </Box>
                )}
              </Grid2>
            </>
          ))}
        {/* {upcomingReminders.length ? ( */}
           <>
{ upcomingReminders.length > 0 ? ( 
            <>
            <Typography variant="h6" sx={{fontWeight: 'bold'}}> Upcoming Reminders </Typography>
              { upcomingReminders?.map((date, idx) => (
                <>
                  <Grid2 container spacing={{ xs: 2, md: 3 }} >
                    <Grid2 key={idx} item size={3} sx={{ width: 'auto', my: 1}}>
                      <Typography variant="h7">{formatReminder(date)}</Typography>

                      {!isBeforeNow(date) && (
                        <Grid2 item size={4}>
                          <Button variant="contained" color="primary" onClick={() => onDelete(date)}>
                            Cancel
                          </Button>
                        </Grid2>
                      )}
                    </Grid2>
                  </Grid2>
                </>
           ))} </>):
           (
            <>
           <Typography variant="h6" sx={{fontWeight: 'bold'}}> Next Available Reminder </Typography>
            <Typography variant="h7">{formatReminder(eventDates[0])}</Typography>
           </>
            )  
           }
          </>
        {/* ) */}
         
         {/* : (
          <Typography variant="h6"> No Reminders </Typography>) */}
{/* } */}
        {Array.isArray(pastReminders) &&
          pastReminders.length  &&  
          <Typography variant="h6" sx={{fontWeight: 'bold'}}>Past Reminders </Typography> }
         { pastReminders?.map((date, idx) => (
            <>
              <Grid2 container spacing={{ xs: 2, md: 3 }}>
                <Grid2 key={idx} item size={3} sx={{ width: 'auto', my: 1 }}>
                  <Typography variant="h7">{formatReminder(date)}</Typography>
                </Grid2>
              </Grid2>
            </>
         ))}          
          

      </Box>
    </>
  );
};
