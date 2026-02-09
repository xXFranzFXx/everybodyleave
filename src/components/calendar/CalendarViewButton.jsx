import React, { useState, useContext } from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useSettingsContext } from "../../context/SettingsProvider";
import { Box, Grid2 } from '@mui/material';
export default function CalendarViewButton() {
  const { view, setView } = useSettingsContext();
  const handleView = (event, newView) => {
    setView(newView);
  };

  return (
  
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={handleView}
      aria-label="views"
      sx={{mt: 5, ml: '40vw'}}
    >
      <ToggleButton value="datepicker" aria-label="datepicker view">
        <EventIcon />
      </ToggleButton>
      <ToggleButton value="calendar" aria-label="calendar view">
        <CalendarMonthIcon/>
      </ToggleButton>
      <ToggleButton value="progress" aria-label="progress view">
        <ShowChartIcon/>
      </ToggleButton>
    </ToggleButtonGroup>
    
  );
}