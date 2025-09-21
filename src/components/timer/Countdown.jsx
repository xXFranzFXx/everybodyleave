/**
Credit: https://codesandbox.io/p/sandbox/countdown-timer-worker-setinterval-px7j8d?file=%2Fsrc%2Fcomponents%2FCountDownTimer.js%3A20%2C29
 */

import {
  Box,
  CircularProgress,
  Typography
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";

const style ={
  container: {
    position: "relative",
    width: "200px",
    height: "auto",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  root: {
    position: "relative"
  },
  bottom: {
    color: "#b2b2b2",
    
  },
  top: {
    animationDuration: "100ms",
    position: "relative",
    float: "left"
  },
  circle: {
    strokeLinecap: "round"
  },
  text: {
    fontWeight: "bold",
    fontSize: "1.35em",
    marginTop: "1em"
  }
};

const Countdown = (props) => {
  const { duration, colors = [], colorValues = [], onComplete, isMobile } = props;

  const [timeDuration, setTimeDuration] = useState(duration);
  const [countdownText, setCountdownText] = useState();
  const [countdownPercentage, setCountdownPercentage] = useState(100);
  const [countdownColor, setCountdownColor] = useState("#004082");

  useEffect(() => {
    let intervalId = setInterval(() => {
      setTimeDuration((prev) => {
        const newTimeDuration = prev - 1;
        const percentage = Math.ceil((newTimeDuration / timeDuration) * 100);
        setCountdownPercentage(percentage);

        if (newTimeDuration === 0) {
          clearInterval(intervalId);
          intervalId = null;
          onComplete();
        }

        return newTimeDuration;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      intervalId = null;
    };
  }, []);

  useEffect(() => {
    const minutes = Math.floor(timeDuration / 60);
    const seconds = timeDuration % 60;
    setCountdownText(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
  }, [timeDuration]);

  useEffect(() => {
    for (let i = 0; i < colorValues.length; i++) {
      const item = colorValues[i];
      if (timeDuration === item) {
        setCountdownColor(colors[i]);
        break;
      }
    }
  }, [timeDuration]);

  return (
    <>
      {/* <Box className={style.container}> */}
        <Box className={style.root}>
          <CircularProgress
            variant="determinate"
            className={style.bottom}
            size={80}
            thickness={4}
            value={100}
          />
          <CircularProgress
            className={style.top}
            classes={{
              circle: style.circle
            }}
            variant="determinate"
            size={80}
            thickness={4}
            value={countdownPercentage}
            style={{
              transform: isMobile ? "scaleX(-1) rotate(-90deg)"  : "translateX(-5rem) scaleX(-1) rotate(-90deg)",
              color: countdownColor
            }}
          />
        </Box>
        <Typography className={style.text}>{countdownText}</Typography>
      {/* </Box> */}
    </>
  );
};

export default Countdown;
