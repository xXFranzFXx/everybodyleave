import React, { useState, useEffect } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { Controller } from 'react-hook-form';

export const FormInputSwitch = ({ control, name, label, setValue }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if(checked) {
        setValue(name, checked)
    }
  },[checked]);

  return (
    <FormControlLabel
      control={
        <Controller
          control={control}
          name={name}
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <Switch
              size="small"
              checked={checked}
              onChange={handleChange}
              slotProps={{ input: { 'aria-label': 'controlled' } }}
            />
          )}
        />
      }
      label={label}
    />
  );
};
