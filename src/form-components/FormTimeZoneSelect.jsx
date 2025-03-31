import React from "react";
import { Controller } from "react-hook-form";
import TimezoneSelect from 'react-timezone-select'

export const FormTimeZoneSelect = ({ name, control, label }) =>  {
   return(
      <Controller 
              as={TimezoneSelect} 
              name={name} 
              control={control} 
              onChange={([selected]) => {
                // React Select return object instead of value for selection
                return { value: selected };
              }}
              defaultValue={{}}
              ref={register({ required: true })}
              rules={{ required: { value: true, message: 'This field is required' } }}
            />
       )
  }