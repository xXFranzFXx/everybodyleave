import React, { useState, useMemo, useCallback }from "react";
import dayjs from 'dayjs';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MenuItem from "@mui/material/node/MenuItem";
import { LocalizationProvider }  from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Controller } from "react-hook-form";
import { renderDigitalClockTimeView } from "@mui/x-date-pickers";
const DATE_FORMAT = "MM-DD-YYYY";
const isInCurrentWeek = (date) => date.get('week') === dayjs().get('week');

/* 
the available days are set to every Mon, Wed, Fri, and 
the available times are 5pm and 7pm.  User can only pick Within the current month.
*/

export const FormInputDateTime = ({ name, control, label  }) => {
    const [val, setVal] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null);
    const now = new Date()
    const currentHour = now.getHours()
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

    const shouldDisableTime =(time, view) => {
        const selectedDay = dayjs(time).date();
        const today = dayjs(now).date();
        const selectedTime = dayjs(time).hour();
          if ( view === "hours") {
              return selectedTime % 2 === 0 || (selectedDay === today && currentHour > selectedTime)         
          } else if (view === "minutes"){ 
              return dayjs(time).minute() <= 0
          }
        return false;
    }

    const shouldDisableDay = (date) => {
         //disable every other day.  
            for (let i = 0; i <= 6; i++) {
                return dayjs(date).day() %2 === 0
              }
      };

    const addOneWeek = () => {
      const date = new Date();
      const oneWeek = date.setDate(date.getDate() + 5); 
      const dayNextWeek = date.getDay(oneWeek);
      if(dayNextWeek < 5){
        return date.setDate(date.getDate() + 5 - dayNextWeek);  
      }
      return oneWeek;
    }
  
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
                  // disablePast={true}
                  minTime={new Date(0,0,0,16)}
                  maxTime={new Date(0,0,0,20)}
                  minDate={new Date()}
                  // maxDate={new Date(dayjs().endOf('month'))}
                  maxDate={addOneWeek()}
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
                  minutesStep={60}
                  views={['year', 'day', 'hours']}
                  viewRenderers={{
                      hours: renderDigitalClockTimeView,
                      minutes: renderDigitalClockTimeView,
                      seconds: renderDigitalClockTimeView,
                  }} 
                  skipDisabled={true}             
                  onError={(newError) => setErrorMsg(newError)}
                  variant="inline"  
                  id={`date-${Math.random()}`} 
                  rifmFormatter={(val) => val.replace(/[^[a-zA-Z0-9-]*$]+/gi, "")} 
                  refuse={/[^[a-zA-Z0-9-]*$]+/gi} 
                  autoOk 
                  KeyboardButtonProps={{
                      "aria-label": "change date",
                  }}                    
                  shouldDisableDate={(date) => shouldDisableDay(date)}
                  shouldDisableTime={(time, view) => shouldDisableTime(time, view)}
                  {...field}     
                />
              );
           }}
          />
      </LocalizationProvider>
    )
}