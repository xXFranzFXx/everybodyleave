import { useCallback, useState, useContext, useRef, useEffect } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuth0 } from '@auth0/auth0-react';
import { FormInputTel } from '../form-components/FormInputTel';
import { FormInputDateTime } from '../form-components/FormInputDateTime';
import { MetadataContext } from '../context/MetadataProvider';
import { Typography, Button, Grid2, Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import { Reminders } from './Reminders';
import { smsVerification } from '../sockets/emit';
import FormDialog from '../form-components/FormDialog';
import LogoutButton from '../components/LogoutButton';
import axios from 'axios';
const SimpleForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { state } = useSocketContext();
  const formDialogRef = useRef();
  const { phone, timezone, scheduledReminder } = state;
  const defaultValues = {
    datetime: '',
    phone: phone || '',
    acceptTerms: '',
    utcdate: '',
    timezone: '',
    message: '',
    saveToCalendar: false,
    rememberSetting: false,
  };
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const { role, reminderDate, mongoId } = user;
  const { saveUserReminder } = useContext(MetadataContext);
  const methods = useForm({ defaultValues: defaultValues || '' });
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const [dateScheduled, setDateScheduled] = useState('');
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedEvent, setSavedEvent] = useState('');

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSaveSuccess(false);
    setValue('datetime', '');
  };
  const setReminder = useCallback(() => {
    state.scheduledReminder = true;
  }, []);

  const saveReminder = async (datetime, phone, timezone) => {
    const token = await getAccessTokenSilently();
    console.log('mongoId: ', mongoId);
    const newDate = new Date(datetime);
    try {
      const response = await axios({
        method: 'POST',
        // url: `http://localhost:4000/api/events/save`,
        url: `https://everybodyleave.onrender.com/api/events/save`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          mongoId: mongoId,
          phone: phone,
          datetime: newDate,
          timezone: timezone,
        },
      });
      const res = await response.data;
      console.log('res.date: ', res.date);
      saveUserReminder(res.date);
      // state.reminder = res.date;
      setReminder();
      setDateScheduled(newDate);
      setSaveSuccess(true);
      return res;
    } catch (err) {
      console.log('Error saving reminder: ', err);
    }
  };
  useEffect(() => {
    if (saveSuccess) {
      smsVerification(phone, dateScheduled);
    }
  }, [saveSuccess]);

  const onSubmit = (data) => {
    const { datetime, message } = data;
    const zeroSeconds = new Date(datetime).setMilliseconds(0);
    const date = new Date(datetime);
    state['utcdate'] = date.toUTCString();
    // formDialogRef.current.handleClickOpen();
    saveReminder(zeroSeconds, phone, timezone);
  };
  useEffect(() => {
    if (saveSuccess) {
      setDialogOpen(true);
    }
  }, [saveSuccess]);

  const handleChange = () => {};

  return (
    <>
      <LogoutButton sx={{ position: 'absolute', right: 0, mr: '5%' }} />

      <FormProvider {...methods}>
        <FormDialog
          ref={formDialogRef}
          control={control}
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
          getValues={getValues}
        />

        <Box
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap',
            alignContent: isMobile ? 'space-around' : 'stretch',
            alignItems: 'stretch',
            justifyItems: isMobile ? 'space-around' : 'stretch',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            gridRowGap: '20px',
            padding: '20px',
            margin: 'auto',
            width: '100%',
            maxWidth: '800px',
            minWidth: '415px',
            marginTop: '30px',
            // borderRadius: '5px',
            // border: '1px solid gray',
          }}
        >
          <Typography variant="h6" align="center" margin="dense">
            Everybodyleave Weekly Reminders
          </Typography>

          <Grid2 container spacing={{ xs: 2, md: 3 }} sx={{ width: '800px' }}>
            <Box
              px={3}
              py={2}
              sx={{ border: '2px solid black', borderRadius: '5px', width: isMobile ? '100%' : '45%', minWidth: '25%' }}
            >
              <Typography variant="h6" align="left" margin="dense">
                Schedule a Reminder
              </Typography>
              <Grid2 size={12} sx={{ width: '100%', my: 2 }}>
                {user && <FormInputTel name="phone" control={control} label="Your Phone" />}
              </Grid2>
              <Grid2 size={12} sx={{ my: 1 }}>
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
            </Box>
            <Box
              px={3}
              py={2}
              sx={{
                border: '2px solid black',
                borderRadius: '5px',
                width: isMobile ? '100%' : '45%',
                height: '100%',
                maxHeight: 275,
                my: isMobile ? 3 : 0,
                overflowY: 'scroll',
              }}
            >
              <Grid2 item>
                <Reminders />
              </Grid2>
            </Box>
          </Grid2>
        </Box>
      </FormProvider>
    </>
  );
};
export default SimpleForm;
