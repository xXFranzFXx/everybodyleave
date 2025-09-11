import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear';
import axios from 'axios';
import { useMetadataContext } from '../context/MetadataProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import MenuItem from '@mui/material/node/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Controller } from 'react-hook-form';
import { renderDigitalClockTimeView } from '@mui/x-date-pickers';
import { useCalendarContext } from '../context/CalendarProvider';
import useFetch from '../hooks/useFetch';
dayjs.extend(weekOfYearPlugin);
dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.tz.setDefault("America/Chicago")
const DATE_FORMAT = 'MM-DD-YYYY';
const isInCurrentWeek = (date) => date.get('week') === dayjs().get('week');

/* 
the available days are set to every Mon, Wed, Fri, and 
the available times are 5pm and 7pm.  User can only pick Within the current month.
*/

export const FormInputDateTime = ({ name, control, label }) => {
  const { scheduledReminders } = useFetch();
  const weekDayArr = [0, 2, 4, 6, 7];

  const [val, setVal] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentTimezone, setCurrentTimezone] = React.useState('system');
  // const [times, setTimes] = useState([]);
  const { events, latestTime, times, dates } = useCalendarContext();
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

  const shouldDisableTime = (time, view) => {
    let scheduled = [];
    const selectedDay = dayjs(time).date();
    const today = dayjs().date();
    const weekday = dayjs(time).day();
    console.log('selectedDay: ', selectedDay);
    const selectedTime = dayjs(time).hour();
    if (scheduledReminders.result.length > 0 && view === 'hours') {
      const reminders = scheduledReminders.result;
      scheduled = reminders.map((result) => dayjs(result).date());
      return (
        weekDayArr.includes(weekday) ||
        dates.includes(selectedDay) ||
        scheduled.includes(selectedDay) ||
        !times.some((t) => t === selectedTime || (today === selectedDay && !(time > dayjs().hour())))
      );
    } else if (view === 'hours') {
      return (
        weekDayArr.includes(weekday) ||
        dates.includes(selectedDay) ||
        !times.some((t) => t === selectedTime || (today === selectedDay && !(time > dayjs().hour())))
      );
    } else if (view === 'minutes') {
      return weekDayArr.includes(weekday) || dayjs(time).minute() <= 0;
    }
    return false;
  };

  const shouldDisableDay = (date) => {
    let scheduled = [];
    const dayDate = dayjs(date).date();
    console.log('dayDate: ', dayDate);
    const weekday = dayjs(date).day();
    console.log('weekday: ', weekday);
    const datesArr = events.map((event) => dayjs(event.date).date());
    const dateSet = new Set(datesArr);
    console.log('dateSet: ', dateSet);
    const pickerDate = dayjs.utc(date).format();
    console.log('pickerDate: ', pickerDate);
    if (scheduledReminders.result.length > 0) {
      const reminders = scheduledReminders.result;
      console.log('reminders: ', reminders);
      scheduled = reminders.map((result) => dayjs(result).date());
      console.log('scheduled: ', scheduled);
      return (
        weekDayArr.includes(weekday) && (reminders.includes(`${pickerDate}`) || scheduled.includes(dayDate) || !dateSet.has(dayDate)) 
        
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
    console.log(
      'maxtime: ',
      dayjs().set('hour', times[2]).set('minute', 0).set('second', 0).set('millisecond', 0).date()
    );
    console.log('times: ', times);
  }, []);
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
