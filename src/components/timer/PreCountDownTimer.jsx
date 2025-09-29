/**
https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks
 */

import React, { useEffect, useState } from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { Typography, Grid2 } from '@mui/material';
import { useTimer } from 'use-timer';
import Countdown from './Countdown';
import './timer.css';

const PreCountDownTimer = ({ initialTime }) => {
  const [showCircle, setShowCircle] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 900,
    endTime: 0,
    timerType: 'DECREMENTAL',
    autostart: true,
    onTimeOver: () => {
      setShowCircle(true);
    },
  });
  const onComplete = () => {
    setShowCircle(false);
    setIsComplete(true)
  }
  const timerMinutes = Math.floor((time % (60 * 60)) / 60);
  const timerSeconds = Math.floor(time % 60);
  return (
    <>
      <Grid2 container>
        {!showCircle && !isComplete && (
          <>
            <Grid2 item size={6} >
              <Typography>Event will begin in:</Typography>
            </Grid2>
            <Grid2 item size={6}>
              <Typography  >
                {timerMinutes} minutes and {timerSeconds} seconds
              </Typography>
            </Grid2>
          </>
        )}
        {showCircle && !isComplete && (
          <>
            <Grid2 item size={12}>
              <Countdown duration={3600} onComplete={onComplete}/>
            </Grid2>
          </>
        )}
      </Grid2>
    </>
  );
};

export default PreCountDownTimer;
