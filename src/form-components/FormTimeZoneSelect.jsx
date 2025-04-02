import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import TimezoneSelect from 'react-timezone-select'
import { useSocketContext } from '../context/SocketProvider';


export const FormTimeZoneSelect = ({ name, control, label }) =>  {
  //set the default timezone to user's local tz 
  const [selectedTz, setSelectedTz] = useState(new  Intl.DateTimeFormat().resolvedOptions().timeZone)
  const { state } = useSocketContext(); 

  const handleSelected = (selected) => {
    return selected ? setSelectedTz(selected.value) : null
  } 

  useEffect(() => {
    state['timezone'] = selectedTz
  },[selectedTz])

    return(
      <Controller 
              name={name} 
              control={control} 
              defaultValue={{}}     
              render={({  field: { onChange, value } }) => (
                <TimezoneSelect  
                  label={label} 
                  value={value ? value : new  Intl.DateTimeFormat().resolvedOptions().timeZone}
                  // onChange={(selected) => handleSelected(selected)}
                  onChange={(selected) => onChange(selected ? selected.value : null)}
                  InputLabelProps={{ shrink: true }}
                />
              )}
               
              rules={{ required: true }}
            />
       )
  }