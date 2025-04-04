import React, { useState, useMemo }from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider }  from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Controller } from "react-hook-form";
const DATE_FORMAT = "MM-DD-YYYY";

export const FormInputDateTime = ({ name, control, label  }) => {
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
        control={control}
        name="datetime"
        rules={{ required: true }}
        render={({ field, fieldState: { error } }) => {
            return (
            <DateTimePicker
                // timezone="system"
                label="Date/Time*"
                value={field.value?? null}
                inputRef={field.ref}
                onChange={(date) => {
                field.onChange(date);
                }}
                slotProps={{
                    textField: {
                      error: !!error,
                      helperText: error ? errorMessage : null,
                      }
                    }}  
                    onError={(newError) => setErrorMsg(newError)}
                    variant="inline"  
                    id={`date-${Math.random()}`} 
                    rifmFormatter={(val) => val.replace(/[^[a-zA-Z0-9-]*$]+/gi, "")} 
                    refuse={/[^[a-zA-Z0-9-]*$]+/gi} 
                    autoOk 
                    KeyboardButtonProps={{
                        "aria-label": "change date",
                    }}    
                    {...field}     
            />
            );
        }}
        />
    </LocalizationProvider>
    )
}