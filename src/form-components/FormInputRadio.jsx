import React, { useEffect } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';
import { useCalendarContext } from '../context/CalendarProvider';

export const FormInputRadio = ({ name, control, label, clickedDay }) => {
  const [radioOptions, setRadioOptions] = React.useState([]);
  const { dtMap, simpleDtMap } = useCalendarContext();
  const { getValues } = useFormContext();
  const data = getValues('dayData');

  const getTimes = () => {
    let unavailable = [];

    const times = simpleDtMap.get(clickedDay);
    const timeSet = new Set(times);
    const timesArr = Array.from(timeSet);
    if (data) {
      unavailable = data.map((day) => parseInt(day.time));
      console.log('dayData: ', data)
      console.log('unavailable: ', unavailable);
      const newArray = timesArr.filter((item) => !unavailable.includes(item));
      console.log('newArray: ', newArray);
      setRadioOptions(newArray);
    } else {
      setRadioOptions(timesArr);
    }
    return times;
  };

  useEffect(() => {
    getTimes();
  }, [clickedDay]);

  const formattedTimes = radioOptions?.map((time) => {
    return (
      {
        label: dayjs().hour(time).minute(0).second(0).millisecond(0).format('h:mm A'),
        value: time,
      } || `There are no available times`
    );
  });

  const generateRadioOptions = () => {
    return formattedTimes?.map((singleOption) => (
      <FormControlLabel value={singleOption.value} label={singleOption.label} control={<Radio />} />
    ));
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
          <RadioGroup value={value} onChange={onChange}>
            {generateRadioOptions()}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};
