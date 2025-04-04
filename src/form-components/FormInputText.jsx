import React from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material/node";

const CHARACTER_LIMIT = 50
export const FormInputText = ({ name, control, label}) => {
    return (
        <>
        <Controller 
            name={name} 
            control={control} 
            render={({ field: { onChange, ref: fieldRef, value, ...fieldProps  }, fieldState: { error } }) => (
                <TextField 
                    inputRef={fieldRef} 
                    helperText={error ? error.message : null} 
                    error={!!error} 
                    onChange={onChange} 
                    value={value?? ""} 
                    fullWidth 
                    label={`${label} ${value? value.length: 0}/${CHARACTER_LIMIT}`} 
                    variant="outlined" 
                    InputLabelProps={{ shrink: true }} 
                    slotProps={{ htmlInput: { maxLength: CHARACTER_LIMIT } }}
                    />
            )} 
            rules={{ required: { value: true, message: 'This field is required' } }}
        />
      </>
    );
};
