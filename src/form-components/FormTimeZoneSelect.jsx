import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import TimezoneSelect from 'react-timezone-select'
import { useSocketContext } from '../context/SocketProvider';
import { FormControl } from "@mui/material/node";
import { FormLabel } from "@mui/material/node";
import { InputLabel } from "@mui/material/node";
export const FormTimeZoneSelect = ({ name, control, label }) =>  {
  //set the default timezone to user's local tz 
  const [selectedTz, setSelectedTz] = useState(new  Intl.DateTimeFormat().resolvedOptions().timeZone)
  const { state } = useSocketContext(); 

  const handleSelected = (selected) => {
    return selected ? setSelectedTz(selected.value) : null
  } 

  // useEffect(() => {
  //   state['timezone'] = selectedTz
  // },[selectedTz])

    return(
      <FormControl>
        <InputLabel  shrink={true}>{label}</InputLabel>
      <Controller 
              name={name} 
              control={control} 
              defaultValue={{selectedTz}}     
              render={({  field: { onChange, value } }) => (
                <TimezoneSelect  
                  
                  value={value ? value : new  Intl.DateTimeFormat().resolvedOptions().timeZone}
                  // onChange={(selected) => handleSelected(selected)}
                  onChange={(selected) => onChange(selected ? selected.value : null)}
                  
                />
              )}
               
             
            />
            </FormControl>
       )
  }