import React, { useEffect, useState } from "react";
import { useSocketContext } from '../context/SocketProvider';

import { Checkbox, FormControl, FormControlLabel, FormLabel, } from "@mui/material";
import { Controller } from "react-hook-form";
const options = [
    {
        label: "Email",
        value: "email",
    },
    {
        label: "SMS",
        value: "sms",
    },
    {
        label: "Voice Call",
        value: "voice",
    },
];
export const FormInputMultiCheckbox = ({ name, control, setValue, label, }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const { state } = useSocketContext();
    
    const handleSelect = (value) => {
        const isPresent = selectedItems.indexOf(value);
        if (isPresent !== -1) {
            const remaining = selectedItems.filter((item) => item !== value);
            state['type'] = remaining;
            setSelectedItems(remaining);
        }
        else {
            setSelectedItems((prevItems) => [...prevItems, value]);
            let newTypes = state.type;
            newTypes = [...newTypes, value];
            state['type'] = newTypes;

        }
    };
    useEffect(() => {
        setValue(name, selectedItems);
        
    }, [selectedItems]);
    return (<FormControl variant="outlined" required>
      <FormLabel component="legend">{label}</FormLabel>

      <div>
        {options.map((option) => {
            return (<FormControlLabel control={<Controller name={name} 
            render={({fieldState: {error}}) => {
                        return (<Checkbox checked={selectedItems.includes(option.value)} onChange={() => handleSelect(option.value)}/>);
                    }} control={control}/>} label={option.label} key={option.value}  />);
        })}
      </div>
    </FormControl>);
};
