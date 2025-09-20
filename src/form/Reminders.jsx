import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocketContext } from '../context/SocketProvider';
import useFetch from '../hooks/useFetch';
import axios from 'axios';
import useCalendar from '../hooks/useCalendar';
import { Typography, Button, Grid2, Box, Divider } from '@mui/material';
import { useCalendarContext } from '../context/CalendarProvider';
import FormDialogCancel from '../form-components/FormDialogCancel';
import dayjs from 'dayjs'

export const Reminders = ({ dateScheduled }) => {
  const { isBeforeNow, formatReminder } = useCalendar();
  const { scheduledReminders, sendCancellationSMS } = useFetch();
  const { state } = useSocketContext();
  const { events } = useCalendarContext();
  let eventDates = [];
  eventDates = events.filter((event) => !isBeforeNow(event.date)).map((e) => e.date);
  eventDates.sort((a,b) => dayjs(a).diff(dayjs(b)))
  const { phone, timezone } = state;
  const { user, getAccessTokenSilently } = useAuth0();
  const {  mongoId, name } = user;
  const [pastReminders, setPastReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false)
  }
  useEffect(() => {
    if (dateScheduled) {
      let upcoming = [...upcomingReminders];
      upcoming = [...upcoming, dateScheduled];
      setUpcomingReminders(upcoming);
    }
 
  }, [dateScheduled]);

  const handleDeleteDate = useCallback((date) => {
    setUpcomingReminders(upcomingReminders.filter((dates) => dates !== date));
    state.hasCancelled = date;
    setDialogOpen(true)
    sendCancellationSMS(name, date)
  }, []);

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
      handleDeleteDate(date);

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

  return (
    <>
    <FormDialogCancel open={dialogOpen} handleDialogClose={handleDialogClose} />
      <Box xs={12} md={6} px={1} py={1} sx={{ width: '100%', p: 1 }}>
        { upcomingReminders.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {' '}
              Upcoming Reminders{' '}
            </Typography>
            { upcomingReminders?.map((date, idx) => (
              <>
                <Grid2 container spacing={{ xs: 2, md: 3 }}>
                  <Grid2 key={idx} item size={3} sx={{ width: 'auto', my: 1 }}>
                    <Typography variant="h7">{formatReminder(date)}</Typography>

                    { !isBeforeNow(date) && (
                      <Grid2 item size={4}>
                        <Button variant="contained" color="primary" onClick={() => onDelete(date)}>
                          Cancel
                        </Button>
                      </Grid2>
                    )}
                  </Grid2>
                </Grid2>
              </>
            ))}
            <Divider sx={{ my: 1 }} />
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {' '}
              Next Available Timeslot{' '}
            </Typography>
            <Typography variant="h7">{formatReminder(eventDates[0])}</Typography>
            <Divider sx={{ my: 1 }} />
          </>
        )}

        {Array.isArray(pastReminders) && pastReminders.length > 0 && 
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Past Reminders{' '}
            </Typography>
            { pastReminders?.map((date, idx) => (
              <>
                <Grid2 container spacing={{ xs: 2, md: 3 }}>
                  <Grid2 key={idx} item size={3} sx={{ width: 'auto', my: 1 }}>
                    <Typography variant="h7">{formatReminder(date)}</Typography>
                  </Grid2>
                </Grid2>
              </>
            ))}
          </>  
        }
      </Box>
    </>
  );
};
