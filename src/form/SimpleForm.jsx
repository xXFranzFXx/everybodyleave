import { useCallback, useState, useContext, useRef } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuth0 } from '@auth0/auth0-react';
import { FormInputTel } from '../form-components/FormInputTel';
import { FormInputDateTime } from '../form-components/FormInputDateTime';
import { MetadataContext } from '../context/MetadataProvider';
import { Typography, Button, Grid2, Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import { Reminders } from './Reminders';
// import FormDialog from '../form-components/FormDialog';
import axios from 'axios';
const SimpleForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { state } = useSocketContext();
  const formDialogRef = useRef();
  const {  phone,  timezone,  scheduledReminder } = state;
  const defaultValues = {
    datetime: '',
    phone: phone || '',
    acceptTerms: '',
    utcdate: '',
    timezone: '',
    message: '',
    saveToCalendar: false,
    rememberSetting: false
  };
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const { role, reminderDate, mongoId } = user;
  const { saveUserReminder } = useContext(MetadataContext);
  const methods = useForm({ defaultValues: defaultValues || '' });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;
  const [error, setError] = useState(false);
  const setReminder = useCallback(() => {
    state.scheduledReminder = true;
  }, []);

  const saveReminder = async (datetime, phone, timezone) => {
    const token = await getAccessTokenSilently();
    console.log('mongoId: ', mongoId);
    try {
      const response = await axios({
        method: 'POST',
        // url: `http://localhost:4000/api/events/save`,
        url:`https://everybodyleave.onrender.com/api/events/save`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          mongoId: mongoId,
          phone: phone,
          datetime: new Date(datetime),
          timezone: timezone,
        },
      });
      const res = await response.data;
      saveUserReminder(res.date);
      state.reminder = res.date;
      setReminder();
      return res;
    } catch (err) {
      console.log('Error saving reminder: ', err);
    }
  };

  const onSubmit = (data) => {
    const { datetime, message } = data;
    const zeroSeconds = new Date(datetime).setMilliseconds(0);
    const date = new Date(datetime);
    state['utcdate'] = date.toUTCString();
    // formDialogRef.current.handleClickOpen();
    saveReminder(zeroSeconds, phone, timezone);
  };

  const handleChange = () => {};

  return (
    <>
      <FormProvider {...methods}>
      {/* <FormDialog ref={formDialogRef} control={control} /> */}
        <Paper
          elevation={2}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            justifyItems: 'stretch',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            gridRowGap: '20px',
            padding: '20px',
            margin: 'auto',
            width: '100%',
            maxWidth: '800px',
            minWidth: '415px',
            marginTop: '30px',
            borderRadius: '5px',
            border: '1px solid gray',
          }}
        >
           <Typography variant="h6" align="center" margin="dense">
            Everybodyleave Weekly Reminders
          </Typography>
        <Box sx={{
          display: 'inline-flex', 
          flexDirection: isMobile ? 'column': 'row', 
          flexWrap: 'wrap',
          alignContent: isMobile ? 'space-around' : 'stretch',
          justifyContent: 'space-around',
          alignItems: 'stretch'}}>
       

          <Box px={3} py={2} sx={{ border: '2px solid black', borderRadius: '5px', width: isMobile ? '100%' : '45%', minWidth: '25%' }}>
            <Grid2 container spacing={{ xs: 2, md: 3 }} >
              <Typography variant="h7" align="center" margin="dense">
                Set Reminder
              </Typography>
              <Grid2 size={12} sx={{ width: '100%' }}>
                {user && <FormInputTel name="phone" control={control} label="Your Phone" />}
              </Grid2>
              <Grid2 size={12}>
                <FormInputDateTime name="datetime" control={control} label="Date/Time*" />
              </Grid2>

              {/* {role === 'basic' &&  scheduledReminder ? (
                <Grid2 item xs={12} sm={4} style={{ paddingTop: 15 }}>
                  <Typography variant="h8" align="center" margin="dense">
                    Upgrade now to schedule multiple reminders
                  </Typography>
                </Grid2>
              ) : (*/}
                <Grid2 item mt={3} size={12}>
                  <Button
                    // disabled={
                    //   role === 'basic'  ? true : false
                    // }
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                    sx={{ width: '100%' }}
                  >
                    Save
                  </Button>
                </Grid2>
              {/* )} */}
            </Grid2> 
          </Box>
          <Box px={3} py={2} sx={{ border: '2px solid black', borderRadius: '5px', width: isMobile? '100%' :'45%', height: '100%' }}>
            <Grid2 container>
              <Grid2 item>
                <Reminders />
              </Grid2>
            </Grid2>
          </Box>
                  </Box>

        </Paper>
      </FormProvider>
   
    </>
  );
};
export default SimpleForm;
