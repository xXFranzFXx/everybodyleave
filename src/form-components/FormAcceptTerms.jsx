import React, { useState, useEffect } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import {
    Paper,
    Box,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox,
    Button
  } from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
export const FormAcceptTerms = ({ control }) => {  
    const { state } = useSocketContext();
    const [accepted, setAccepted] = useState(false)
    const {
        register,
        formState: { errors }
      } = useForm({
       // resolver: yupResolver(validationSchema)
      });
    const handleChange = (value) => {
        setAccepted(value);
       
    }
    useEffect(() => {
        state['acceptTerms'] = accepted
     },[accepted]);

      return (
            <>
                <FormControlLabel
                control={
                <Controller
                    control={control}
                    name="acceptTerms"
                    defaultValue="false"
                    inputRef={register()}
                    render={({ field: { onChange } }) => (
                    <Checkbox
                        value={accepted}
                        color="primary"
                        onChange={e => handleChange(e.target.checked)}
                    />
                    )}
                />
                }
                label={
                <Typography color={errors.acceptTerms ? 'error' : 'inherit'}>
                    I have read and agree to the Terms *
                </Typography>
                }
                />
                <br />
                <Typography variant="inherit" color="textSecondary">
                    {errors.acceptTerms
                    ? '(' + errors.acceptTerms.message + ')'
                    : ''}
                </Typography>
            </>
      )
}