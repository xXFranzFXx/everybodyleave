import React from "react";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { Controller, useForm } from "react-hook-form";
import { useSocketContext } from "../context/SocketProvider";

export const FormInputTel = ({ name, control, label }) => {
  const { state } = useSocketContext();
  const { phone } = state;
  
  return (
      <Controller
        name={name}
        control={control}
        rules={{ validate: (value) => matchIsValidTel(phone ?? value, { onlyCountries: ['US'] }) }}
        render={({ field: { ref: fieldRef, value, ...fieldProps }, fieldState }) => (
          <MuiTelInput
            {...fieldProps}
            defaultCountry="US"
            value={phone ?? ''}
            inputRef={fieldRef}
            disabled={phone ? true : false}
            helperText={fieldState.invalid ? "enter valid number ex: 123 555 5555" : ""}
            error={fieldState.invalid}
            label={label}
          />
        )}
      />   
  )
}

