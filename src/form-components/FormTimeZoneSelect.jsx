import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import TimezoneSelect from 'react-timezone-select'
import { useSocketContext } from '../context/SocketProvider';


export const FormTimeZoneSelect = ({ name, control, label }) =>  {
  const [selectedTz, setSelectedTz] = useState( new  Intl.DateTimeFormat().resolvedOptions().timeZone)
  const { state } = useSocketContext(); 
  const handleSelected = (selected) => {
    return selected ? setSelectedTz(selected.value) :null
  } 
  useEffect(() => {
    state['timezone'] = selectedTz
  },[selectedTz])
    return(
      <Controller 
              // as={TimezoneSelect} 
              name={name} 
              
              control={control} 
              render={({  field: { onChange, value } }) => (
                <TimezoneSelect  
                  label={label} 
                  value={selectedTz}
                  onChange={(selected) => handleSelected(selected)}
                />
              )}
              defaultValue={{}}      
              rules={{ required: true }}
            />
       )
  }