import React, { useState, useMemo }from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider }  from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Controller } from "react-hook-form";
const DATE_FORMAT = "MM-DD-YYYY";

export const FormInputDate = ({ name, control, label  }) => {
    const [errorMsg, setErrorMsg] = useState(null);
    const errorMessage = useMemo(() => {
        switch (errorMsg) {
          
          case 'invalidDate': {
            return 'date is not valid';
          }
    
          default: {
            return 'date is required';
          }
        }
      }, [errorMsg]);

    return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller 
        name={name} 
        control={control} 
        render={({ field, fieldState: { error } }) => (
          <DatePicker  
              inputFormat={DATE_FORMAT} 
              maxDate={new Date()} 
              defaultValue={new Date()}
              slotProps={{
              textField: {
                error: !!error,
                helperText: error ? errorMessage : "",
                }
              }}  
              onError={(newError) => setErrorMsg(newError)}
              variant="inline"  
              id={`date-${Math.random()}`} 
              label={label} 
              rifmFormatter={(val) => val.replace(/[^[a-zA-Z0-9-]*$]+/gi, "")} 
              refuse={/[^[a-zA-Z0-9-]*$]+/gi} 
              autoOk 
              KeyboardButtonProps={{
                  "aria-label": "change date",
              }}         
              {...field}
          />       
        )} 
        rules={{
          required: true, 
      }}
    />
    </LocalizationProvider>);
};
