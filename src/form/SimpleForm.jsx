import React, { useEffect, useCallback, useState, useContext, useRef } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider,  useForm } from 'react-hook-form';
import { useAuth0 } from '@auth0/auth0-react';
import { FormInputTel } from '../form-components/FormInputTel';
import { FormInputText } from '../form-components/FormInputText';
import { FormInputDate } from '../form-components/FormInputDate';
import { TimePick } from '../form-components/FormInputTime';
import { FormTimeZoneSelect } from '../form-components/FormTimeZoneSelect';
import { FormInputDateTime } from '../form-components/FormInputDateTime';
import { twilioSms, textBeeSms, cronTextBeeSms } from '../sockets/emit';
import { MetadataContext } from '../context/MetadataProvider';
import { TextField, FormControlLabel, Typography, Checkbox, Button, Grid2, Box, Paper } from '@mui/material';
import { Reminders } from './Reminders';
import axios from 'axios';
const SimpleForm = () => {
    const { state } = useSocketContext();
    const { type, phone, acceptTerms, default_timezone, otp, timezone, reminder, scheduledReminder } = state;
    const defaultValues = {
        datetime:"",
        phone: phone || "",
        acceptTerms:"",
        utcdate: "",
        timezone:"",
        message:"",
    }
    const { user, logout, getAccessTokenSilently } = useAuth0();
    const { role, reminderDate, mongoId } = user;
    const { saveUserReminder } = useContext(MetadataContext);
    const methods = useForm({ defaultValues: defaultValues || ""});
    const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
    const [error, setError] = useState(false);
     const setReminder = useCallback(() => {
      state.scheduledReminder = true;
    },[])
    
    const saveReminder = async (datetime, phone, timezone) => {
     const token = await getAccessTokenSilently();
     console.log("mongoId: ", mongoId)
     try {
             const response = await   axios({
                    method: 'POST',
                    url: `http://localhost:4000/api/events/save`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data:{
                      mongoId: mongoId,
                      phone: phone,
                      datetime: new Date(datetime), 
                      timezone: timezone
                    }
                })
                const res = await response.data;
                saveUserReminder(res.date)
                state.reminder = res.date
                setReminder();
                return res;
              } catch (err) {
                console.log("Error saving reminder: ", err)
              }
          }

   
    const onSubmit = (data) => {
        const {datetime, message} = data;
        const zeroSeconds = new Date(datetime).setMilliseconds(0);
        const date = new Date(datetime);
        console.log(date.getTime())
        console.log(date.toISOString())
        state['utcdate'] = date.toUTCString();
        data.utcdate = date.toUTCString();
        // const reminder = {
        //   event: datetime,
        //   message: message
        // }
        data.timezone = timezone
        saveReminder(zeroSeconds, phone, timezone)
        // textBeeSms(data)
        // logout();
        // cronTextBeeSms(data)
        // textBeeSms(data);
    }
    const handleChange = () => {}
//  useEffect(() => {
// console.log(getValues("reminder"))
//  },[getValues("reminder")])
    return (
      <>        
      <FormProvider {...methods}>
        <Paper
            elevation={24}
            style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "stretch",
                justifyItems: "stretch",
                flexDirection: "row",
                justifyContent: "space-evenly",
                gridRowGap: "20px",
                padding: "20px",
                margin: "auto",
                width: "auto",
                maxWidth: "620px",
                minWidth: "250px",
                marginTop: "30px",
                borderRadius: "5px",
                border: "1px solid gray"
            
            }} 
        >
           <Typography variant="h6" align="center" margin="dense">
            Everybodyleave Weekly Reminders
          </Typography>

        <Box px={3} py={2}  sx={{border: '2px solid black', borderRadius: '5px', width: '45%'}}>        
                   <Grid2 container spacing={{ xs: 2, md: 3 }} columnSpacing={{ xs: 12, sm: 10, md: 3 }}>

         <Typography variant="h7" align="center" margin="dense">
           Set Reminder
          </Typography>
          <Grid2 size={12} sx={{width: '100%'}}>
            { user &&          
              <FormInputTel name="phone" control={control} label="Your Phone" />
            }
          </Grid2>
          <Grid2 size={12}>
            <FormInputDateTime name="datetime" control={control} label="Date/Time*" />
          </Grid2>
          
          {
            role === 'basic' && (new Date(reminderDate) > new Date() && scheduledReminder) ? 
         ( <Grid2 item xs={12} sm={4} style={{paddingTop: 15}} >
            <Typography variant="h6" align="center" margin="dense">
                Upgrade now to schedule multiple reminders
          </Typography>          </Grid2>  )
          :

          (<Grid2 item mt={3} size={12}>
            <Button
            disabled={(role === 'basic' && (new Date(reminderDate) > new Date()) && scheduledReminder)? true: false}
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              sx={{width: '100%'}}
            >
              Save
            </Button>        
          </Grid2>  )   
}
</Grid2>
        </Box>  
        <Box px={3} py={2}  sx={{border: '2px solid black', borderRadius: '5px', width: '45%'}}>   
        <Grid2 container>
        <Grid2 item>
        <Reminders/>
        </Grid2>
        </Grid2>
        </Box>
      </Paper>   
        
        </FormProvider>
        {/* {state.scheduledReminder &&
        <Reminders/>
} */}
        </>

    )
}
export default SimpleForm;