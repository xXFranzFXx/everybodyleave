import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, Controller } from 'react-hook-form';
import { FormLabel } from '@mui/material';
import { useForm } from "react-hook-form";
import { FormInputTel } from '../form-components/FormInputTel';
import { FormInputText } from '../form-components/FormInputText';
import { FormInputDate } from '../form-components/FormInputDate';
import { TimePick } from '../form-components/FormInputTime';
import { FormInputMultiCheckbox } from '../form-components/FormInputMultiCheckbox';
import { FormAcceptTerms } from '../form-components/FormAcceptTerms';
import { FormInputEmail } from '../form-components/FormInputEmail';
import { FormTimeZoneSelect } from '../form-components/FormTimeZoneSelect';
import { cronTextBeeSms } from '../sockets/emit';
import {  Typography, Button, Grid2, Box, Paper } from '@mui/material';
const MainForm = () => {
    const { state } = useSocketContext();

    const defaultValues = {
        date: new Date(),
        phone: "",
        time: "",
        method: "",
        reminder:"",
        type: "",
        timezone: "",
        acceptTerms:"",
    }
    const methods = useForm({ defaultValues: defaultValues || ""});
    const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
    const { type, acceptTerms } = state;
    const onSubmit = (data) => {
        console.log(data);      
        cronTextBeeSms(data)
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
            <FormInputMultiCheckbox name="reminder" setValue={setValue} control={control} label="Reminder Type"  />
          </Grid2>
      {
        type.includes('email')  && 
          <Grid2 item xs={12} sm={4}>
            <FormInputEmail control={control} />
          </Grid2>
      }
      {
        (type.includes('sms') || type.includes('voice')) &&
          <Grid2 item xs={12} sm={4}>
            <FormInputTel name="phone" control={control} label="Phone*" />
          </Grid2>
     } 
      <Grid2 item xs={12} sm={4}>
            <FormInputDate name="date" control={control} label="Date*" />
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <TimePick name="time" control={control} label="Time*" />
            </Grid2>

          <Grid2 item xs={12} sm={4}>
            <FormTimeZoneSelect name="timezone" control={control}  label="Timezone*" />
          </Grid2>
        
          <Grid2 item xs={12} sm={4}>
            <FormInputText name="message" control={control} label="Message*" />
          </Grid2>
         
            <Grid2 item xs={12} sm={12}>
             <FormAcceptTerms />
            </Grid2>
          </Grid2>
          <Box mt={3}>
            <Button
              disabled={!acceptTerms}
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
        </FormProvider>
    )
}
export default MainForm;