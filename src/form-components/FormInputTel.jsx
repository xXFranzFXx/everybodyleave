import React, { useState } from 'react';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { Controller, useForm } from 'react-hook-form';
import { useSocketContext } from '../context/SocketProvider';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const FormInputTel = ({ name, control, label }) => {
  const { state } = useSocketContext();
  const { phone } = state;
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword)
  };
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{ validate: (value) => matchIsValidTel(phone ?? value, { onlyCountries: ['US'] }) }}
        render={({ field: { ref: fieldRef, value, ...fieldProps }, fieldState }) => (
          <MuiTelInput
            {...fieldProps}
            defaultCountry="US"
            value={showPassword ? phone: ""}
            inputRef={fieldRef}
            disabled={phone ? true : false}
            helperText={fieldState.invalid ? 'enter valid number ex: 123 555 5555' : ''}
            error={fieldState.invalid}
            label={label}
            fullWidth
          />
        )}
      />
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        edge="end"
        sx={{position: 'absolute', transform: 'translateX(-2.5rem)'}}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </>
  );
};
