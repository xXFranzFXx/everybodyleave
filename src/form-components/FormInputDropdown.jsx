import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";
const options = [
    {
        label: "digital",
        value: "digital",
    },
    {
        label: "analog",
        value: "analog",
    },
];
export const FormInputDropdown = ({ name, control, label }) => {
    const generateSingleOptions = () => {
        return options.map((option) => {
            return (<MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>);
        });
    };
    return (<FormControl>
      <InputLabel>{label}</InputLabel>
      <Controller render={({ field: { onChange, value } }) => (<Select onChange={onChange} value={value}>
            {generateSingleOptions()}
          </Select>)} control={control} name={name}/>
    </FormControl>);
};
