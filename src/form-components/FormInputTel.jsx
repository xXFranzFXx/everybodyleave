import React from "react";
import ReactDOM from "react-dom";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { Controller, useForm } from "react-hook-form";

export const FormInputTel = ({name, control, label}) => {
  
  return (
      <Controller
        name={name}
        control={control}
        rules={{ validate: (value) => matchIsValidTel(value, { onlyCountries: ['US'] }) }}
        render={({ field: { ref: fieldRef, value, ...fieldProps }, fieldState }) => (
          <MuiTelInput
            {...fieldProps}
            defaultCountry="US"
            value={value ?? ''}
            inputRef={fieldRef}
            helperText={fieldState.invalid ? "Tel is invalid" : ""}
            error={fieldState.invalid}
            label={label}
          />
        )}
      />
    
  )
}

