import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import useCalendar from '../hooks/useCalendar';
import { useSettingsContext } from '../context/SettingsProvider';

export default function FadeMenu({ label, callback, buttonLabel, sx, date }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isMobile } = useSettingsContext();
  const { fifteenMinuteLimit, outsideFifteenMinutes } = useCalendar();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); 
  };
  const handleClose = () => {
  
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={sx}
      >
        {label}
      </Button>
      <Menu
        id="fade-menu"
         sx={{ marginLeft: isMobile? '15%' : '3%' }}
        slotProps={{
          list: {
            'aria-labelledby': 'fade-button',
          },
        }}
        slots={{ transition: Fade }}
        anchorEl={anchorEl || []}
        open={open}
        onClose={handleClose}
      >
        <MenuItem sx={{background: 'cornflowerblue', color: 'white'}} disabled={!outsideFifteenMinutes(date)} onClick={() => callback()}>{buttonLabel}</MenuItem>
      </Menu>
    </div>
  );
}