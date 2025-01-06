import {
    Paper,
    Box,
    Grid,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox,
    Button
  } from '@material-ui/core';

import { Controller, useForm } from 'react-hook-form';
export const FormAcceptTerms = () => {  
    const {
        register,
        control,
       
        formState: { errors }
      } = useForm({
       // resolver: yupResolver(validationSchema)
      });
      return (
            <>
                <FormControlLabel
                control={
                <Controller
                    control={control}
                    name="acceptTerms"
                    defaultValue="false"
                    inputRef={register()}
                    render={({ field: { onChange } }) => (
                    <Checkbox
                        color="primary"
                        onChange={e => onChange(e.target.checked)}
                    />
                    )}
                />
                }
                label={
                <Typography color={errors.acceptTerms ? 'error' : 'inherit'}>
                    I have read and agree to the Terms *
                </Typography>
                }
                />
                <br />
                <Typography variant="inherit" color="textSecondary">
                    {errors.acceptTerms
                    ? '(' + errors.acceptTerms.message + ')'
                    : ''}
                </Typography>
            </>
      )
}