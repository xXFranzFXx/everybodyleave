import React, { useState, useEffect } from 'react';
import useCalendar from '../hooks/useCalendar';
import { useSocketContext } from '../context/SocketProvider';
import { useCalendarContext } from '../context/CalendarProvider';
import Carousel from 'react-material-ui-carousel';
import { Typography, Divider } from '@mui/material';
import { useSettingsContext } from '../context/SettingsProvider';
import FadeMenu from '../form-components/FormFadeMenu';
import useFetch from '../hooks/useFetch';
import dayjs from 'dayjs';

const NextAvailable = ({handleSaveReminder}) => {
  const { events } = useCalendarContext();
  const { isMobile } = useSettingsContext();
  const { saveReminder, scheduledReminders } = useFetch();
  const { state } = useSocketContext();
  const { phone, timezone } = state;
  const { isBeforeNow, formatReminder, fifteenMinuteLimit } = useCalendar();
  let eventDates = [];
  eventDates = events.filter((event) => !isBeforeNow(event.date)).map((e) => e.date);
  eventDates.sort((a, b) => dayjs(a).diff(dayjs(b)));
  const sorted = Array.from(new Set(eventDates))
  const currentSchedule = scheduledReminders.result?.filter(el => !isBeforeNow(el))
  const available = sorted.filter( ( el ) => !currentSchedule?.includes( el ) );
  // console.log("available: ", available)
  const sx = { fontSize: isMobile? '1.1rem': '.8rem', mt: 2, ml: 6, width: '75%',pt: 1, height: 85}
  return (
    <div>
      <Typography variant="h6" sx={{ fontWeight: 'bold', my: 2, ml: 3}}>
         Available Timeslots
      </Typography>
      <Carousel 
       indicators={false}
       navButtonsAlwaysInvisible={false}
       navButtonsAlwaysVisible={true}
        navButtonsWrapperProps={{   // Move the buttons to the bottom. Unsetting top here to override default style.
        style: {
            bottom: '0',
            top: 'unset',
            paddingTop: 10
            
        }
    }} 
     navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
        style: {
            backgroundColor: 'cornflowerblue',
            borderRadius: 0,
            width: 10,
          
        
        }}}
       >
        {available.map((date, i) => (
          <FadeMenu key ={`av-${i}`} date={date} label={formatReminder(date)} sx={sx} callback={() => handleSaveReminder(date, phone, timezone)} buttonLabel="Schedule Reminder"/>
          // <Typography key={i}  sx={{ fontSize: isMobile? '1.3rem': '1rem', mt: 2, ml: 6, width: '75%',pt: 1, height: 85}}>
          //   {formatReminder(date)}
          // </Typography>
        ))}
      </Carousel>
      {/* <Divider sx={{ my: 2 }} /> */}
    </div>
  );
};

export default NextAvailable;
