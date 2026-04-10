import React, { useState, useContext } from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useSettingsContext } from "../../context/SettingsProvider";
import { useNavigate, useLocation } from 'react-router'

import { Box, Grid2 } from '@mui/material';
export default function CalendarViewButton() {
   const navigate = useNavigate();
  const location = useLocation();
  const { view, setView } = useSettingsContext();
  const handleNavigation = (event, newPath) => {
    // Prevent deselecting (MUI returns null if clicking an already active button)
    if (newPath !== null && newPath !== location.pathname) {
      navigate(newPath,  { viewTransition: true });
    }
  };

  return (
  <Box  size={12} sx={{ display: 'flex', justifyContent: 'center', position: 'sticky',
          top: 0,
          zIndex: 1,
          height: 35,
          backgroundColor: 'white',
         
          }}>

    <ToggleButtonGroup
      value={location.pathname}
      exclusive
      onChange={handleNavigation}
      aria-label="views"
      sx={{backgroundColor: 'white', zIndex: 9}}
    >
      <ToggleButton value="/" aria-label="datepicker view">
        <EventIcon />
      </ToggleButton>
      <ToggleButton value="/calendar" aria-label="calendar view">
        <CalendarMonthIcon/>
      </ToggleButton>
      <ToggleButton value="/progress" aria-label="progress view">
        <ShowChartIcon/>
      </ToggleButton>
    </ToggleButtonGroup>
    </Box>
  );
}