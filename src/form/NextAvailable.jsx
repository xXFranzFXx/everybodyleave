import React, { useState, useEffect, useCallback } from 'react';
import useCalendar from '../hooks/useCalendar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormInputText } from '../form-components/FormInputText';
import { useSocketContext } from '../context/SocketProvider';
import { useCalendarContext } from '../context/CalendarProvider';
import Carousel from 'react-material-ui-carousel';
import { Typography, Divider, Box, Button } from '@mui/material';
import { useSettingsContext } from '../context/SettingsProvider';
import FadeMenu from '../form-components/FormFadeMenu';
import useFetch from '../hooks/useFetch';
import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';

const NextAvailable = ({ onSubmit, control }) => {
  const { events } = useCalendarContext();
  const { isMobile } = useSettingsContext();
  const { resetField, getValues, handleSubmit, setValue } = useFormContext();
  const { saveReminder, scheduledReminders } = useFetch();
  const { state } = useSocketContext();
  const { phone, timezone, intention } = state;
  const { isBeforeNow, formatReminder, fifteenMinuteLimit } = useCalendar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newIntention, setNewIntention] = useState('');

  let eventDates = [];
  eventDates = events.filter((event) => !isBeforeNow(event.date)).map((e) => e.date);
  eventDates.sort((a, b) => dayjs(a).diff(dayjs(b)));
  const sorted = Array.from(new Set(eventDates));
  const currentSchedule = scheduledReminders.result?.filter((el) => !isBeforeNow(el));
  console.log("current schedule: ", currentSchedule)
  const scheduledDates = currentSchedule?.map(event => dayjs(event).date());
 //do not display timeslots for dates that have a scheduled reminder already
  const available = sorted.filter((el) => !scheduledDates?.includes(dayjs(el).date()) && (dayjs(el).date() < dayjs(el).add(7, 'd').date()));
  // console.log("available: ", available)
  const checkIntention = (date) => {
    // setSelectedDate(date);
    // setDialogOpen(true);
    setValue("datetime", date)
    handleSubmit(onSubmit);
  };
 
  const handleDialogClose = () => {
    setDialogOpen(false);
    resetField('intention2')
  };

  const sx = { fontSize: isMobile ? '1.1rem' : '.8rem', mt: 2, ml: 6, width: '75%', pt: 1, height: 85 };
  return (
    <div>
      <Typography variant="h6" sx={{ fontWeight: 'bold', my: 2, ml: 3 }}>
        Available Timeslots
      </Typography>
      <Carousel
        indicators={false}
        navButtonsAlwaysInvisible={false}
        navButtonsAlwaysVisible={true}
        navButtonsWrapperProps={{
          // Move the buttons to the bottom. Unsetting top here to override default style.
          style: {
            // bottom: '0',
            // top: 'unset',
            paddingTop: 0,
            paddingBottom: 0
          },
        }}
        navButtonsProps={{
          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
          style: {
            backgroundColor: 'cornflowerblue',
            borderRadius: 0,
            width: 10,
          },
        }}
      >
        {available.map((date, i) => (
          <div key={`av-${i}`}>
            <FadeMenu
              showIntention={true}
              date={date}
              label={formatReminder(date)}
              sx={sx}
              callback={() => checkIntention(date)}
              buttonLabel="Schedule Reminder"
              control={control}
            />
          </div>
        ))}
      </Carousel>

      {/* <Divider sx={{ my: 2 }} /> */}
    </div>
  );
};

export default NextAvailable;
