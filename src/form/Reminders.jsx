import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { FormInputDropdown } from '../form-components/FormInputDropdown';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { subscribe, useSnapshot } from 'valtio';

import { TextField, FormControlLabel, Typography, Checkbox, Button, Grid2, Box, Paper } from '@mui/material';

export const Reminders = () => {
  dayjs.extend(calendar);
  const currentDate = dayjs();
  const customFormat = {
    sameDay: '[Today at] h:mm A',
    nextDay: '[Tomorrow at] h:mm A',
    nextWeek: '[Next] dddd [at] h:mm A',
    lastDay: '[Yesterday at] h:mm A',
    lastWeek: '[Last] dddd [at] h:mm A',
    sameElse: 'DD[th of] MMMM YYYY [at] h:mm A',
  };
  const { state } = useSocketContext();
  const { snap } = useSnapshot(state);
  const { phone, timezone } = state;
  const { user, getAccessTokenSilently } = useAuth0();
  const { reminderDate, mongoId } = user;
  const [displayedDate, setDisplayedDate] = useState();
  const [pastReminders, setPastReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  // const methods = useForm({ defaultValues: defaultValues || ""});
  // const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
  const isBeforeNow = (date) => {
    return new Date(date) < new Date();
  };
  const onDelete = async () => {
    const token = await getAccessTokenSilently();

    console.log('mongoId: ', mongoId);
    try {
      const response = await axios({
        method: 'PUT',
        url: `http://localhost:4000/api/events/remove`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          mongoId: mongoId,
          phone: phone,
          datetime: new Date(reminderDate),
          timezone: timezone,
        },
      });
      const res = await response.data;
      setDisplayedDate('');
      return res;
    } catch (err) {
      console.log('Error cancelling reminder: ', err);
    }
  };

  const onEdit = () => {};
  useEffect(
    () =>
      subscribe(state, () => {
        const callback = () => {
          if (state.scheduledReminder) {
            // conditionally update local state
            // let newDate = [...displayedDate, state.reminder]
            setDisplayedDate(state.reminder);
          }
        };
        const unsubscribe = subscribe(state, callback);
        callback();
        return unsubscribe;
      }),
    []
  );
  useEffect(() => {
    let reminders = [];
    if (Array.isArray(reminderDate) && reminderDate.length) {
      reminders = reminderDate.map(({ eventDate }) => eventDate);
      setDisplayedDate(reminders);
    }
  }, [reminderDate]);
  return (
    <>
      <Box xs={12} md={6} px={1} py={2} sx={{ width: '100%', p: 1 }}>
        <Typography variant="h8">{displayedDate ? 'Scheduled Reminders' : 'No Upcoming Reminders'}</Typography>
        {displayedDate &&
          displayedDate.map((date, idx) => (
            <>
              <Grid2 container spacing={{ xs: 2, md: 3 }}>
                <Grid2 key={idx} item size={12} sx={{ width: 'auto' }}>
                  <Typography variant="h7">
                    {/* {isBeforeNow(date) ? 'Past Reminders' : 'Upcoming Reminders'} */}
                    {dayjs(date).calendar(currentDate, customFormat)}
                  </Typography>
                </Grid2>
                {displayedDate && !isBeforeNow(date) && (
                  <Box mt={3}>
                    <Button variant="contained" color="primary" onClick={onDelete}>
                      Delete
                    </Button>
                    {/* <Button
                      variant="contained"
                      color="primary"
                      onClick={onEdit}
                    >
                      Edit
                    </Button>     */}
                  </Box>
                )}
              </Grid2>
            </>
          ))}
      </Box>
    </>
  );
};
