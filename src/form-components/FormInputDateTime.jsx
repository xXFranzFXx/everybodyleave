import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Controller } from 'react-hook-form';
import { renderDigitalClockTimeView } from '@mui/x-date-pickers';
import { useCalendarContext } from '../context/CalendarProvider';
import useFetch from '../hooks/useFetch';
dayjs.extend(weekOfYearPlugin);
dayjs.extend(utc);
dayjs.extend(timezone);
const DATE_FORMAT = 'MM-DD-YYYY';
const isInCurrentWeek = (date) => date.get('week') === dayjs().get('week');

export const FormInputDateTime = ({ name, control, label }) => {
  const { scheduledReminders } = useFetch();
  const weekDayArr = [0, 2, 4, 6, 7];

  const [errorMsg, setErrorMsg] = useState(null);
  const [currentTimezone, setCurrentTimezone] = React.useState('system');
  const { events, times, dates } = useCalendarContext();
  
  const now = new Date();
  const currentHour = now.getHours();
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


const checkTimeFinalCall = (time) => {
      const specificHour = dayjs().hour(time).minute(0).second(0).millisecond(0);
      const fifteenMinutesBeforeNextHour= specificHour.subtract(15, 'minute');
      // console.log("time 15 min before specific hour: ", dayjs(fifteenMinutesBeforeNextHour).format())
      return fifteenMinutesBeforeNextHour;
  }

  const shouldDisableTime = (time, view) => {
    let scheduled = [];
    const selectedDay = dayjs(time).date();
    const today = dayjs().date();
    const weekday = dayjs(time).day();
    const selectedTime = dayjs(time).hour();
    // console.log("selectedDay: ", selectedDay)
   

    if (scheduledReminders?.result.length > 0 && view === 'hours') {
      const reminders = scheduledReminders?.result;
      scheduled = reminders.map((result) => dayjs(result).date());
      return (
        weekDayArr.includes(weekday) ||
        dates.includes(selectedDay) ||
        scheduled.includes(selectedDay) ||
        !times.some((t) => t === selectedTime || (today === selectedDay && !(time > dayjs().hour()) || dayjs().format() === checkTimeFinalCall(time)))
      );
    } else if (view === 'hours') {
      return (
        weekDayArr.includes(weekday) ||
        dates.includes(selectedDay) ||
        !times.some((t) => t === selectedTime || (today === selectedDay && (!(time > dayjs().hour()) || dayjs().format() === checkTimeFinalCall(time)) ))
      );
    } else if (view === 'minutes') {
      return weekDayArr.includes(weekday) || dayjs(time).minute() <= 0;
    }
    return false;
  };

  const shouldDisableDay = (date) => {
    let scheduled = [];
    const dayDate = dayjs(date).date();
    const weekday = dayjs(date).day();
    const datesArr = events.map((event) => dayjs(event.date).date());
    const dateSet = new Set(datesArr);
    const pickerDate = dayjs.utc(date).format();
    if (scheduledReminders?.result.length > 0) {
      const reminders = scheduledReminders.result;
      scheduled = reminders.map((result) => dayjs(result).date());
      return (
        weekDayArr.includes(weekday) ||
        reminders.includes(`${pickerDate}`) ||
        scheduled.includes(dayDate) ||
        !dateSet.has(dayDate)
      );
    } else {
      return weekDayArr.includes(weekday) || !dateSet.has(dayDate);
    }
  };

  const addOneWeek = () => {
    const date = new Date();
    const oneWeek = date.setDate(date.getDate() + 5);
    const dayNextWeek = date.getDay(oneWeek);
    if (dayNextWeek < 5) {
      return date.setDate(date.getDate() + 5 - dayNextWeek);
    }
    return oneWeek;
  };
 useEffect(() => {
  checkTimeFinalCall(17)
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
              disablePast={true}
              // minTime={dayjs().hour(times[0]- 1)}
              // maxTime={dayjs().hour(times[2])}
              minDate={new Date()}
              maxDate={addOneWeek()}
              label="Date/Time*"
              value={field.value ?? null}
              inputRef={field.ref}
              onChange={(date) => {
                field.onChange(date);
              }}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error ? errorMessage : null,
                  fullWidth: true,
                },
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
              rifmFormatter={(val) => val.replace(/[^[a-zA-Z0-9-]*$]+/gi, '')}
              refuse={/[^[a-zA-Z0-9-]*$]+/gi}
              autoOk
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              shouldDisableDate={(date) => shouldDisableDay(date)}
              shouldDisableTime={(time, view) => shouldDisableTime(time, view)}
              referenceDate={
                currentHour < 16
                  ? dayjs().set('hours', times[0]).set('minutes', 0).set('seconds', 0)
                  : dayjs().set('hours', times[2]).set('minutes', 0).set('seconds', 0)
              }
              {...field}
            />
          );
        }}
      />
    </LocalizationProvider>
  );
};
