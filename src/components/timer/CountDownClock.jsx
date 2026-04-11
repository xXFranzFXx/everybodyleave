import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid2 } from '@mui/material';

const CountDownClock = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        // days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        // hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 10),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && interval !== 'seconds') {
      return;
    }

    timerComponents.push(
      <Grid2 item key={interval} xs={6} sm={3} md={2}>
        <Box sx={{
          textAlign: 'center',
          p: 3,
          ml:4,
          borderRadius: '15px',
          //  background: 'linear-gradient(to top, rgb(6, 64, 31),rgba(25, 118, 86, 0.44))', backgroundBlendMode: 'multiply',
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px) saturate(180%)',
          border: '1px solid rgba(209, 213, 219, 0.3)',
          boxShadow: '0px 8px 32px 0px rgba(0, 0, 0, 0.37)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.45)',
          },
        }}>
          <Typography variant="h3" sx={{
            fontWeight: 'bold',
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}>
            {String(timeLeft[interval]).padStart(2, '0')}
          </Typography>
          <Typography variant="h6" sx={{
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.8)',
            letterSpacing: '1px',
          }}>
            {interval}
          </Typography>
        </Box>
      </Grid2>
    );
  });

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{
          fontFamily: "'Orbitron', sans-serif",
          color: '#fff',
          textShadow: '0 0 10px rgba(0, 114, 255, 0.7), 0 0 20px rgba(0, 114, 255, 0.7), 0 0 30px rgba(0, 114, 255, 0.7)',
          mb:5,
          mr:5,
          animation: 'glow 1.5s ease-in-out infinite alternate',
          '@keyframes glow': {
            'from': {
              textShadow: '0 0 10px rgba(0, 114, 255, 0.7), 0 0 20px rgba(0, 114, 255, 0.7), 0 0 30px rgba(0, 114, 255, 0.7)',
            },
            'to': {
              textShadow: '0 0 20px rgba(0, 114, 255, 0.9), 0 0 30px rgba(0, 114, 255, 0.9), 0 0 40px rgba(0, 114, 255, 0.9)',
            },
          }
      }}>
        You're Leave Will Begin In
      </Typography>
      <Grid2 container spacing={3} justifyContent="center">
        {timerComponents.length ? (
          timerComponents
        ) : (
          <Typography variant="h5" align="center" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            The wait is over!
          </Typography>
        )}
      </Grid2>
    </Box>
  );
};

export default CountDownClock;
