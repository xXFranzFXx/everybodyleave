import { Controller } from 'react-hook-form';
import { Box, FormControl, FormLabel,  FormControlLabel, Checkbox } from '@mui/material';

export const FormInputCheckBox = ({ name, label, control }) => {
  return (
    <FormControl variant="outlined" required>
      <FormLabel component="legend">{label}</FormLabel>
      <FormControlLabel
        control={
          <Controller
            control={control}
            name={name}
            defaultValue={false}
            render={({ field: { onChange, value } }) => <Checkbox checked={value} onChange={onChange} />}
          />
        }
      />
    </FormControl>
  );
};
