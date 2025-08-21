import React from "react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, } from "@mui/material";
import { Controller } from "react-hook-form";
import useGetDates from "../hooks/useGetDates";
import dayjs from "dayjs";
const options = [
    {
        label: "6:00pm",
        value: 18,
    },
    {
        label: "8:00pm",
        value: 20,
    },
];
export const FormInputRadio = ({ name, control, label }) => {
    const { times } = useGetDates()
   
    const formattedTimes = times.map(time => { 
         return { 
                label: dayjs().hour(time).minute(0).second(0).millisecond(0).format('hh:mm A'), 
                value: time 
                }
            })
    
    
    const generateRadioOptions = () => {
        return formattedTimes.map((singleOption) => (<FormControlLabel value={singleOption.value} label={singleOption.label} control={<Radio />}/>));
    };
    return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller name={name} control={control} render={({ field: { onChange, value }, fieldState: { error }, formState, }) => (<RadioGroup value={value} onChange={onChange}>
            {generateRadioOptions()}
          </RadioGroup>)}/>
    </FormControl>);
};
