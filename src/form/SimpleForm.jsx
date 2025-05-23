import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, Controller } from 'react-hook-form';
import { useForm } from "react-hook-form";
import OTPInput from '../form-components/FormOtpInputs';
import { MuiOtpInput } from "mui-one-time-password-input";
import { FormOtpInput } from '../form-components/FormOtpInput'
import { FormInputTel } from '../form-components/FormInputTel';
import { FormInputText } from '../form-components/FormInputText';
import { FormInputDate } from '../form-components/FormInputDate';
import { TimePick } from '../form-components/FormInputTime';
import { FormTimeZoneSelect } from '../form-components/FormTimeZoneSelect';
import { FormInputDateTime } from '../form-components/FormInputDateTime';
import { twilioSms, textBeeSms, cronTextBeeSms } from '../sockets/emit';
import { TextField, FormControlLabel, Typography, Checkbox, Button, Grid2, Box, Paper } from '@mui/material';
const SimpleForm = () => {
    const defaultValues = {
        datetime:"",
        phone: "",
        acceptTerms:"",
        utcdate: "",
        timezone:"", 
        message:"",
        otp:""
    }
    const methods = useForm({ defaultValues: defaultValues || ""});
    const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
    const { state } = useSocketContext();
    const { type, acceptTerms, default_timezone, otp } = state;
    const onSubmit = (data) => {
        const {datetime} = data;
        const date = new Date(datetime);
        console.log(date.getTime())
        console.log(date.toISOString())
        state['utcdate'] = date.toUTCString();
        data.utcdate = date.toUTCString();
        data.timezone = default_timezone
        // cronTextBeeSms(data)
        textBeeSms(data);
    }
    const handleChange = () => {}
//  useEffect(() => {
// console.log(getValues("reminder"))
//  },[getValues("reminder")])
    return (
        <FormProvider {...methods}>
        <Paper
            elevation={24}
            style={{
                display: "grid",
                flexWrap: "wrap",
                gridRowGap: "20px",
                padding: "20px",
                margin: "auto",
                width: "auto",
                maxWidth: "620px",
                minWidth: "250px",
                marginTop: "30px"
            }} 
        >
           <Typography variant="h6" align="center" margin="dense">
            Everybodyleave Scheduled Reminder
          </Typography>
        <Box px={3} py={2}>
         
          <Grid2 container spacing={{ xs: 2, md: 3 }} columnSpacing={{ xs: 12, sm: 10, md: 3 }}>
          <Grid2 item xs={12} sm={4}>
            <FormInputTel name="phone" control={control} label="Phone*" />
          </Grid2>

          <Grid2 item xs={12} sm={4}>
            <FormInputDateTime name="datetime" control={control} label="Date/Time*" />
          </Grid2>
          </Grid2>
          <Grid2 item xs={12} sm={4} style={{paddingTop: 15}} >
            <FormInputText name="message" control={control} label="Message*" />
          </Grid2>
          
      {/* <Grid2 item xs={12} sm={4}>
            <FormInputDate name="date" control={control} label="Date*" />
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <TimePick name="time" control={control} label="Time*" />
            </Grid2> */}

          {/* <Grid2 item xs={12} sm={4}>
            <FormTimeZoneSelect name="timezone" control={control}  label="Timezone*" />
          </Grid2> */}
        
          
          <Box mt={3}>
            <Button
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
export default SimpleForm;