import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, Controller } from 'react-hook-form';
import { useForm } from "react-hook-form";
import { FormInputTel } from '../form-components/FormInputTel';
import { FormInputText } from '../form-components/FormInputText';
import { FormInputDate } from '../form-components/FormInputDate';
import { TimePick } from '../form-components/FormInputTime';
import { FormInputMultiCheckbox } from '../form-components/FormInputMultiCheckbox';
import { FormInputDropdown } from '../form-components/FormInputDropdown';
import { FormAcceptTerms } from '../form-components/FormAcceptTerms';
import { FormInputEmail } from '../form-components/FormInputEmail';
import { twilioSms } from '../sockets/emit';
import { TextField, FormControlLabel, Typography, Checkbox, Button, Grid2, Box, Paper } from '@mui/material';
const MainForm = () => {
    const defaultValues = {
        date: "",
        phone: "",
        time: "",
        method: "",
        reminder:"",
        type: "",
        acceptTerms:"",
    }
    // const { state } = useSocketContext();
    const methods = useForm({ defaultValues: defaultValues || ""});
    const { handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;

    const onSubmit = (data) => {
        console.log(data);      
        console.log(data.time);
        twilioSms(data);
    }

    return (
        <FormProvider {...methods}>
        <Paper
            style={{
                display: "grid",
                flexWrap: "wrap",
                gridRowGap: "20px",
                padding: "20px",
                margin: "auto",
                width: "auto",
                maxWidth: "620px",
                minWidth: "250px",
                marginTop: "30px",
                boxShadow: "none"  
            }} 
        >
        <Box px={3} py={2}>
          <Typography variant="h6" align="center" margin="dense">
            Everybodyleave Scheduled Reminder
          </Typography>
         
          <Grid2 container spacing={{ xs: 2, md: 3 }} columnSpacing={{ xs: 12, sm: 10, md: 3 }}>
          <Grid2 item xs={12} sm={4}>
            <FormInputEmail control={control} />
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <FormInputTel name="phone" control={control} label="Phone*" />
          </Grid2>
          
          <Grid2 item xs={12} sm={12}>
            <TimePick name="time" control={control} label="Time*" />
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <FormInputDate name="date" control={control} label="Date*" />
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <FormInputMultiCheckbox name="reminder" setValue={setValue} control={control} label="Reminder" />
          </Grid2>
            <Grid2 item xs={12} sm={12}>
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
            </Grid2>
          </Grid2>
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