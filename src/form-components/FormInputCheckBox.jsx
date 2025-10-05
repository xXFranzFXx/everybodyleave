import { Controller } from 'react-hook-form';
import { Box, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export const FormInputCheckBox = ({ name, label, title, control }) => {
  return (
    <FormControl variant="outlined" required>
      {/* <FormLabel component="legend">{title}</FormLabel> */}
      <FormGroup row>
      <FormControlLabel
        control={
          <Controller
            control={control}
            name={name}
            defaultValue={false}
            render={({ field: { onChange, value } }) => <Checkbox checked={value} onChange={onChange}  />}
           
          />
        }
         label={label} 
         labelPlacement="end"
      />
      </FormGroup>
    </FormControl>
  );
};
