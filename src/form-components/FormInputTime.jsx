import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Controller } from "react-hook-form";

export const TimePick = ({ name, control, label }) =>  {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TimePicker   
            label={label}
            value={value ? dayjs(value, 'HH:mm') : null}
            onChange={(time) => onChange(time ? time.format('HH:mm') : '')} 
            ampm={false}
          />
        )}
      />
    </LocalizationProvider>
  );
}
