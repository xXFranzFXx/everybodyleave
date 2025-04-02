import React from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material/node";

export const FormInputText = ({ name, control, label}) => {
    return (
        <>
        <Controller 
            name={name} 
            control={control} 
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField helperText={error ? error.message : null} error={!!error} onChange={onChange} value={value} fullWidth label={label} variant="outlined" InputLabelProps={{ shrink: true }}/>
            )} 
            rules={{ required: { value: true, message: 'This field is required' } }}
        />
      </>
    );
};
