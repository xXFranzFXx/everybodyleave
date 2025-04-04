import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, Controller } from 'react-hook-form';
import { useForm } from "react-hook-form";
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
        utcdate: ""
    }
    const methods = useForm({ defaultValues: defaultValues || ""});
    const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
    const { state } = useSocketContext();
    const { type, acceptTerms, timezone } = state;
    const onSubmit = (data) => {
      
        console.log(data);  
        const {datetime} = data;
        const date = new Date(datetime);
        // console.log(date.getHours()) 
        // console.log(date.getMinutes())  
        // console.log(date.toUTCString())
        // console.log(data.time);
        state['utcdate'] = date.toUTCString();
        data.utcdate = date.toUTCString();
        cronTextBeeSms(data)
        // textBeeSms(data);
    }
//  useEffect(() => {
// console.log(getValues("reminder"))
//  },[getValues("reminder")])
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
            <FormInputTel name="phone" control={control} label="Phone*" />
          </Grid2>

          <Grid2 item xs={12} sm={4}>
            <FormInputDateTime name="datetime" control={control} label="Date/Time*" />
          </Grid2>

          <Grid2 item xs={12} sm={4}>
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
        
          </Grid2>
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