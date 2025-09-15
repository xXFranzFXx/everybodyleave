import React, { useEffect} from "react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, } from "@mui/material";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import { useCalendarContext } from "../context/CalendarProvider";
// const options = [
//     {
//         label: "6:00pm",
//         value: 18,
//     },
//     {
//         label: "8:00pm",
//         value: 20,
//     },
// ];
export const FormInputRadio = ({ name, control, label, clickedDay }) => {
    const [radioOptions, setRadioOptions]= React.useState([])
    const { dtMap, simpleDtMap } = useCalendarContext();
     
     const getTimes = () => {
     const times = simpleDtMap.get(clickedDay);
     const timeSet = new Set(times)
     setRadioOptions(Array.from(timeSet))
     return times;
  }
     
    useEffect(() => {
        getTimes();
    },[clickedDay]);

    const formattedTimes =  radioOptions?.map(time => { 
         return { 
                label: dayjs()
                        .hour(time)
                        .minute(0)
                        .second(0)
                        .millisecond(0)
                        .format('h:mm A'), 
                value: time 
            } || `There are no available times`
        });
    
    
    
    const generateRadioOptions = () => {
        return formattedTimes?.map((singleOption) => (
            <FormControlLabel 
                value={singleOption.value} 
                label={singleOption.label} 
                control={ 
                    <Radio /> 
                    } 
            /> 
        ));
    };

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <Controller 
                name={name} 
                control={control} 
                render={({ field: { onChange, value }, fieldState: { error }, formState, }) => (
                    <RadioGroup value={value} onChange={onChange}>
                        {generateRadioOptions()}
                    </RadioGroup>
                )}
            />
        </FormControl>
    );
}
