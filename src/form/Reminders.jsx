import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocketContext } from '../context/SocketProvider';
import { useSettingsContext } from '../context/SettingsProvider';
import useFetch from '../hooks/useFetch';
import axios from 'axios';
import useCalendar from '../hooks/useCalendar';
import { Typography, Button, Grid2, Box, Divider } from '@mui/material';
import { useCalendarContext } from '../context/CalendarProvider';
import FormDialogCancel from '../form-components/FormDialogCancel';
import PreCountdownTimer from '../components/timer/PreCountDownTimer';
import FormDialog from '../form-components/FormDialog';
import Carousel from 'react-material-ui-carousel';
import FadeMenu from '../form-components/FormFadeMenu';
import dayjs from 'dayjs'

export const Reminders = ({ dateScheduled }) => {
  const { isMobile } = useSettingsContext();
  const dialog = {
   errorMessage:  `The cut-off time for cancelling is 15 minutes before the scheduled reminder. If reminders are not cancelled within the required time, it will be counted as incomplete.   To avoid receiving an incomplete status, be sure to cancel prior to the cut off time.`,
   errorTitle: `Reminders must be cancelled before cut-off time`
}
  const { isBeforeNow, formatReminder, fifteenMinuteLimit } = useCalendar();
  const { scheduledReminders, sendCancellationSMS } = useFetch();
  const { state } = useSocketContext();
  const { events } = useCalendarContext();
  let eventDates = [];
  eventDates = events.filter((event) => !isBeforeNow(event.date)).map((e) => e.date);
  eventDates.sort((a,b) => dayjs(a).diff(dayjs(b)))
  const { phone, timezone } = state;
  const { user, getAccessTokenSilently } = useAuth0();
  const {  mongoId, name, profileName } = user;
  const [pastReminders, setPastReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false)
  const handleDialogClose = () => {
    setDialogOpen(false)
    setErrorOpen(false)
  }
  useEffect(() => {
    if (dateScheduled) {
      let upcoming = [...upcomingReminders];
      upcoming = [...upcoming, dateScheduled];
      setUpcomingReminders(upcoming);
    }
  
 
  }, [dateScheduled]);
  const countdownTime = (date) => {
    return dayjs(date).valueOf();
  }
  const handleDeleteDate = (date) => {
    setUpcomingReminders(upcomingReminders.filter((dates) => dates !== date));
    state.hasCancelled = date;
    setDialogOpen(true)
    sendCancellationSMS(name, date)
  };

  const onDelete = async (date) => {
    const token = await getAccessTokenSilently();
    console.log('mongoId: ', mongoId);
    if ( fifteenMinuteLimit(date)) {
      setErrorOpen(true);

    }
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
  const menuSx= { fontSize: isMobile? '1rem': '.8rem', mt: 2, ml: isMobile? 7 : 6, width: '75%',pt: 1, height: 85}
  const onEdit = () => {};

  return (
    <>
    <FormDialog open={errorOpen} handleDialogClose={handleDialogClose} message={dialog.errorMessage} title={dialog.errorTitle} />
    <FormDialogCancel open={dialogOpen} handleDialogClose={handleDialogClose} />
      <Box xs={12} md={6} px={1} py={1} sx={{ width: '100%', p: 1, height: '100%' }}>
              {!upcomingReminders.length && 
                   <Typography  sx={{ fontWeight: 'bold', fontSize: isMobile? '1rem': '.8rem', justifySelf: 'center' }}>
                   You have no scheduled reminders
                   </Typography>
              }

        { upcomingReminders.length > 0 && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', justifySelf: 'center'}}>
              {' '}
              {profileName}'s Upcoming Leaves{' '}
            </Typography>
              <Carousel 
                   indicators={false}
                   navButtonsAlwaysInvisible={false}
                   navButtonsAlwaysVisible={true}
                    navButtonsWrapperProps={{   // Move the buttons to the bottom. Unsetting top here to override default style.
                    style: {
                        bottom: '0',
                        top: 'unset',
                        paddingTop: 5
                        
                    }
                }} 
                 navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
                    style: {
                        backgroundColor: 'cornflowerblue',
                        borderRadius: 0,
                        width: 10,
                      
                    
                    }}}
                   >
                    {upcomingReminders?.map((date, i) => (
                  
<>
                      <FadeMenu key ={i} sx={menuSx} label={formatReminder(date)} date={date} callback={() => onDelete(date)} buttonLabel="Cancel Reminder" />
                        <Divider sx={{ paddingTop: '.5px'}} />
                      <Typography key={`ur-${i}`}  sx={{ fontSize: isMobile? '1.1rem': '1rem', justifySelf: 'center', paddingTop: '3px', paddingBottom: '10px'}}>
                        {i + 1} of {upcomingReminders.length}
                      </Typography>
                      </>
                    ))}
                  </Carousel>
            {/* { upcomingReminders?.map((date, idx) => (
              <>
                <Grid2 container spacing={{ xs: 2, md: 3 }}>
                  <Grid2 key={idx} item size={3} sx={{ width: 'auto', my: 1 }}>
                    <Typography variant="h7">{formatReminder(date)}</Typography>
                    { !isBeforeNow(date) && (
                      <Grid2 item size={4}>
                        <Button variant="contained" disabled={fifteenMinuteLimit(date)} color="primary" onClick={() => onDelete(date)}>
                          Cancel
                        </Button>
                      </Grid2>
                    )}
                  </Grid2>
                </Grid2>
              </>
            ))} */}
          
          </>
        ) }
         <Typography variant="h6" sx={{ fontWeight: 'bold', justifySelf: 'center' }}>
              {profileName}'s Previous Leaves{' '}
            </Typography>
        {Array.isArray(pastReminders) && pastReminders.length > 1 ?  
        
          <>
            
            
          <Carousel 
                   indicators={false}
                   navButtonsAlwaysInvisible={false}
                   navButtonsAlwaysVisible={true}
                    navButtonsWrapperProps={{   // Move the buttons to the bottom. Unsetting top here to override default style.
                    style: {
                        bottom: '0',
                        top: 'unset',
                        paddingTop: 5
                        
                    }
                }} 
                 navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
                    style: {
                        backgroundColor: 'cornflowerblue',
                        borderRadius: 0,
                        width:10,
                       
                    
                    }}}
                   >
                         { pastReminders?.map((date, idx) => (
              <>
                {/* <Grid2 container spacing={{ xs: 2, md: 3 }}> */}
                  {/* <Grid2 key={idx} item size={3} sx={menuSx}> */}
                    <Typography key={`pr-${idx}`} sx={{fontSize: isMobile? '1rem': '.8rem', mt: 2, ml: isMobile? 7 : 6, width: '75%',pt: 1, height: 85}}>{formatReminder(date)}</Typography>
                      {/* <Divider sx={{ paddingTop: '25px'}} /> */}
                      {/* <Typography key={`pr2-${idx}`}  sx={{ fontSize: isMobile? '1.1rem': '1rem', justifySelf: 'center', paddingTop: '3px', paddingBottom: '2px'}}>
                        {idx + 1} of {pastReminders.length}
                      </Typography> */}
                  {/* </Grid2> */}
                {/* </Grid2> */}
              </>
            ))}
                   </Carousel>
        
          </>  
          :
           <>
                {/* <Grid2 container spacing={{ xs: 2, md: 3 }}>
                  <Grid2  item size={3} sx={{ width: 'auto', my: 1 }}>
                    <Typography variant="h7" sx={{justifySelf: 'center'}}>{formatReminder(pastReminders[0])}</Typography>
                  </Grid2>
                </Grid2>
               */}
          </>
        }
      </Box>
     
    </>
  );
};
