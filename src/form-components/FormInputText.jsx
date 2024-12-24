import React from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
export const FormInputText = ({ name, control, label }) => {
    return (<Controller name={name} control={control} render={({ field: { onChange, value }, fieldState: { error }, formState, }) => (<TextField helperText={error ? error.message : null} error={!!error} onChange={onChange} value={value} fullWidth label={label} variant="outlined"/>)} rules={{ required: { value: true, message: 'This field is required' } }}/>);
};
