import {useState, useCallback, useEffect}from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import useCalendar from '../hooks/useCalendar';
import { useSettingsContext } from '../context/SettingsProvider';
import { useFormContext } from 'react-hook-form';
import { FormInputText } from './FormInputText';
export default function FadeMenu({ label, callback, buttonLabel, sx, date, showIntention, control}) {
  const [anchorEl, setAnchorEl] = useState(null);
  // const [open, setOpen] = useState(false)
  const { isMobile } = useSettingsContext();
  const { fifteenMinuteLimit, outsideFifteenMinutes } = useCalendar();
  const { resetField, getValues } = useFormContext();
  const [intent, setIntent] = useState("")
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); 
    // setOpen(true)
  };

 
  const handleClose = () => {
  
    setAnchorEl(null);
    // setOpen(false)
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
         sx={{ marginLeft: isMobile? '15%' : '1%' }}
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
      { showIntention && 
        <MenuItem sx={{ color: 'white'}} disabled={!outsideFifteenMinutes(date)}><FormInputText name="intention2" label="intention" control={control} /></MenuItem>
}
        <MenuItem sx={{background: 'cornflowerblue', color: 'white'}} disabled={!outsideFifteenMinutes(date)} onClick={() => callback(date)}>{buttonLabel}</MenuItem>
      </Menu>
    </div>
  );
}