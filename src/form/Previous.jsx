import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import useFetch from '../hooks/useFetch';
import useCalendar from '../hooks/useCalendar';
import { Typography, Button, Grid2, Box, Divider } from '@mui/material';
import { useCalendarContext } from '../context/CalendarProvider';

import Carousel from 'react-material-ui-carousel';
import dayjs from 'dayjs';

const Previous = () => {
  const { isBeforeNow, formatReminder } = useCalendar();
  const { scheduledReminders } = useFetch();
  const { events } = useCalendarContext();
  let eventDates = [];
  eventDates = events.filter((event) => !isBeforeNow(event.date)).map((e) => e.date);
  eventDates.sort((a, b) => dayjs(a).diff(dayjs(b)));
  const { user, getAccessTokenSilently } = useAuth0();
  const { mongoId, name, profileName } = user;
  const [pastReminders, setPastReminders] = useState([]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setErrorOpen(false);
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

  return (
    <>
      <Box xs={12} md={6} px={1} py={1} sx={{ width: '100%', p: 1, height: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', justifySelf: 'center' }}>
          {profileName}'s Previous Leaves{' '}
        </Typography>
        {(Array.isArray(pastReminders) && pastReminders.length > 1 ) && (
          <>
            <Carousel
              indicators={false}
              navButtonsAlwaysInvisible={false}
              navButtonsAlwaysVisible={true}
              navButtonsWrapperProps={{
                // Move the buttons to the bottom. Unsetting top here to override default style.
                style: {
                  bottom: '0',
                  top: 'unset',
                  paddingTop: 5,
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
              {pastReminders?.map((date, idx) => (
                <>
                  <Typography
                    key={`pr-${idx}`}
                    sx={{
                      fontSize: isMobile ? '1rem' : '.8rem',
                      mt: 2,
                      ml: isMobile ? 7 : 6,
                      width: '75%',
                      pt: 1,
                      height: 85,
                    }}
                  >
                    {formatReminder(date)}
                  </Typography>
            
                </>
              ))}
            </Carousel>
          </>
        ) }
      </Box>
    </>
  );
};
export default Previous;