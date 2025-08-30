import React, { useState, useMemo, useEffect, useCallback }from "react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'
import weekOfYearPlugin from "dayjs/plugin/weekOfYear";
import axios from 'axios';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MenuItem from "@mui/material/node/MenuItem";
import { LocalizationProvider }  from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Controller } from "react-hook-form";
import { renderDigitalClockTimeView } from "@mui/x-date-pickers";
import useGetDates from "../hooks/useGetDates";
import { format, milliseconds } from "date-fns";
dayjs.extend(weekOfYearPlugin);
dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.tz.setDefault("America/Chicago")
const DATE_FORMAT = "MM-DD-YYYY";
const isInCurrentWeek = (date) => date.get('week') === dayjs().get('week');

/* 
the available days are set to every Mon, Wed, Fri, and 
the available times are 5pm and 7pm.  User can only pick Within the current month.
*/

export const FormInputDateTime = ({ name, control, label  }) => {
    const [val, setVal] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null);
    const [currentTimezone, setCurrentTimezone] = React.useState('system');
    // const [times, setTimes] = useState([]);
    const { events, latestTime, times } = useGetDates();
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
            return !times.some(time => time === selectedTime  || (today === selectedDay && !(time < dayjs().hour())))
        } else if (view === "minutes"){ 
            return dayjs(time).minute() <= 0
        }
        return false;
    }

    const shouldDisableDay = (date) => {
      const dates = events.map(event => format(event.date, 'yyyy-MM-dd'))
      const dateSet = new Set(dates)
      const pickerDate = format(date, 'yyyy-MM-dd')
      return !dateSet.has(pickerDate)
         
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
  useEffect(() => {
    console.log("maxtime: ", dayjs().set('hour', times[2]).set('minute', 0).set('second', 0).set('millisecond', 0).date())
  },[])
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Controller
          control={control}
          name="datetime"
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => {
              return (
              <DateTimePicker
                  timezone="system"
                  // disablePast={true}
                  minTime={dayjs().hour(times[0]- 1)}
                  maxTime={dayjs().hour(times[2])}
                  minDate={new Date()}
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
                      // minutes: renderDigitalClockTimeView,
                      // seconds: renderDigitalClockTimeView,
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
                  referenceDate={currentHour < 16 ? dayjs().set("hours", times[0]).set("minutes", 0).set("seconds", 0) : dayjs().set("hours",times[2]).set("minutes", 0).set("seconds", 0)}
                  {...field}     
                />
              );
           }}
          />
      </LocalizationProvider>
    )
}