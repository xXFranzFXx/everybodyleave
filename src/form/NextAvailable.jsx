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

const NextAvailable = ({handleSaveReminder, control, getValues}) => {
  const { events } = useCalendarContext();
  const { isMobile } = useSettingsContext();
  
  const { saveReminder, scheduledReminders } = useFetch();
  const { state } = useSocketContext();
  const { phone, timezone, intention } = state;
  const { isBeforeNow, formatReminder, fifteenMinuteLimit } = useCalendar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
 const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

 
  
  let eventDates = [];
  eventDates = events.filter((event) => !isBeforeNow(event.date)).map((e) => e.date);
  eventDates.sort((a, b) => dayjs(a).diff(dayjs(b)));
  const sorted = Array.from(new Set(eventDates))
  const currentSchedule = scheduledReminders.result?.filter(el => !isBeforeNow(el))
  const available = sorted.filter( ( el ) => !currentSchedule?.includes( el ) );
  // console.log("available: ", available)
  const checkIntention = (date) => {
    const intention2 = getValues("intention2");
    setSelectedDate(date)
    if (intention2) {
      handleSaveReminder(date, phone, timezone, intention2); 
    } else {
      setDialogOpen(true);
    }
  }
 
  const handleDialogClose = () => {
    setDialogOpen(false)
  }
  const handleClose = () => {
       setAnchorEl(null)
  }
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
          <FadeMenu key ={`av-${i}`}  anchorEl={anchorEl} onClose={handleClose} open={open} date={date} label={formatReminder(date)} sx={sx} callback={() => checkIntention(date)} buttonLabel="Schedule Reminder"/>
          // <Typography key={i}  sx={{ fontSize: isMobile? '1.3rem': '1rem', mt: 2, ml: 6, width: '75%',pt: 1, height: 85}}>
          //   {formatReminder(date)}
          // </Typography>
        ))}
     
      </Carousel>
         { !intention &&
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <Box sx={{ display: 'inline-flex' }}>
                  <DialogTitle>Please Set An Intention For Your Leave </DialogTitle>
                </Box>
     <Divider sx={{ my: 1 }} />
                  <Divider sx={{ my: 2 }} />
               
                      <FormInputText name="intention2" label="intention" control={control}/>                
                                     <DialogContent sx={{ paddingBottom: 0 }}>

                  <DialogActions>
                    <Button onClick={handleDialogClose}>Ok</Button>
                  </DialogActions>
                </DialogContent>
              </Dialog>
}
      {/* <Divider sx={{ my: 2 }} /> */}
    </div>
  );
};

export default NextAvailable;
