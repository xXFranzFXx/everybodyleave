import React from 'react';
import CountdownTimer from './CountdownTimer';
import { Box } from '@mui/material';
import darkDoors from '../../assets/doors.png'
const CountdownPage = () => {
    //set this to 15 min prior to leave start
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 1);

  return (
    <>
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 120px)', // Adjust height for header/footer
      p: 3,
      backgroundImage: `url(${darkDoors})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      opacity: '.6'
    }}>
    </Box>
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1}}>
    <CountdownTimer targetDate={targetDate} />
    </Box>
    </>
  );
};

export default CountdownPage;
