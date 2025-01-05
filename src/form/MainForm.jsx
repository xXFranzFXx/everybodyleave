import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider } from 'react-hook-form';
import { useForm } from "react-hook-form";
import { FormInputDate } from '../form-components/FormInputDate';
import { FormInputTel } from '../form-components/FormInputTel';
import { FormInputTime } from '../form-components/FormInputTime';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './ValidationSchema';
import * as Yup from 'yup';

const MainForm = () => {
    
    const { state } = useSocketContext();
    const methods = useForm({ defaultValues: state || "", resolver: yupResolver(validationSchema) });
    const { handleSubmit, getValues, reset, control, setValue, formState: { errors } } = methods;



    return (
        <FormProvider {...methods}>
        <Paper>
        <Box px={3} py={2}>
          <Typography variant="h6" align="center" margin="dense">
            Everybodyleave scheduled reminder
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                id="fullname"
                name="fullname"
                label="Full Name"
                fullWidth
                margin="dense"
                {...register('fullname')}
                error={errors.fullname ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.fullname?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="username"
                name="username"
                label="Username"
                fullWidth
                margin="dense"
                {...register('username')}
                error={errors.username ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.username?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="email"
                name="email"
                label="Email"
                fullWidth
                margin="dense"
                {...register('email')}
                error={errors.email ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.email?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="password"
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="dense"
                {...register('password')}
                error={errors.password ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.password?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                margin="dense"
                {...register('confirmPassword')}
                error={errors.confirmPassword ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.confirmPassword?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>

          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Paper>
        </FormProvider>
    )

}
export default MainForm;