import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { useSettingsContext } from '../context/SettingsProvider';
export default function FadeMenu({label, callback}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isMobile } = useSettingsContext();
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
        sx={{ fontSize: isMobile? '1.3rem': '1rem', mt: 2, ml: 6, width: '75%',pt: 1, height: 85}}
      >
        {label}
      </Button>
      <Menu
        id="fade-menu"
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
        <MenuItem onClick={() => callback()}>Schedule Reminder</MenuItem>
      </Menu>
    </div>
  );
}