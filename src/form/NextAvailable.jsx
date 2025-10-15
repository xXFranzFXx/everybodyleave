import React, { useState, useEffect } from 'react';
import useCalendar from '../hooks/useCalendar';
import { useCalendarContext } from '../context/CalendarProvider';
import Carousel from 'react-material-ui-carousel';
import { Typography, Divider } from '@mui/material';
import { useSettingsContext } from '../context/SettingsProvider';
import useFetch from '../hooks/useFetch';
import dayjs from 'dayjs';
// carouselStyle = {
//     buttonWrapper: {
//         position: "absolute",
//         height: "100px",
//         backgroundColor: "transparent",
//         top: "calc(50% - 70px)",
//         '&:hover': {
//             '& $button': {
//                 backgroundColor: "#00EEFF",
//                 filter: "brightness(120%)",
//                 opacity: "0.4"
//             }
//         }
//     },
//     fullHeightHoverWrapper: {
//         height: "100%",
//         top: "0"
//     },
//     buttonVisible:{
//         opacity: "1"
//     },
//     buttonHidden:{
//         opacity: "0",
//     },
//     button: {
//         margin: "0 10px",
//         position: "relative",
//         backgroundColor: "#494949",
//         top: "calc(50% - 20px) !important",
//         color: "white",
//         fontSize: "30px",
//         transition: "200ms",
//         cursor: "pointer",
//         '&:hover': {
//             opacity: "0.6 !important"
//         },
//     },
//     // Applies to the "next" button wrapper
//     next: {
//         right: 0
//     },
//     // Applies to the "prev" button wrapper
//     prev: {
//         left: 0
//     }
// }
const NextAvailable = () => {
  const { events } = useCalendarContext();
  const { isMobile } = useSettingsContext();
  const { scheduledReminders } = useFetch();
  
  const { isBeforeNow, formatReminder, fifteenMinuteLimit } = useCalendar();
  let eventDates = [];
  eventDates = events.filter((event) => !isBeforeNow(event.date)).map((e) => e.date);
  eventDates.sort((a, b) => dayjs(a).diff(dayjs(b)));
  const sorted = Array.from(new Set(eventDates))
  const currentSchedule = scheduledReminders.result?.filter(el => !isBeforeNow(el))
  const available = sorted.filter( ( el ) => !currentSchedule?.includes( el ) );
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
          <Typography key={i}  sx={{ fontSize: isMobile? '1.3rem': '1rem', mt: 2, ml: 6, width: '75%',pt: 1, height: 85}}>
            {formatReminder(date)}
          </Typography>
        ))}
      </Carousel>
      {/* <Divider sx={{ my: 2 }} /> */}
    </div>
  );
};

export default NextAvailable;
