import { useState, useEffect } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInputTel } from '../form-components/FormInputTel';
import { FormInputDateTime } from '../form-components/FormInputDateTime';
import { FormInputText } from '../form-components/FormInputText';
import { FormInputCheckBox } from '../form-components/FormInputCheckBox';
import { useSettingsContext } from '../context/SettingsProvider';
import { useAuth0 } from '@auth0/auth0-react';
import { subscribe } from 'valtio';
import { Typography, Button, Grid2, Box, Paper } from '@mui/material';
import { Reminders } from './Reminders';
import useFetch from '../hooks/useFetch';
import useCalendar from '../hooks/useCalendar';
import FormDialog from '../form-components/FormDialog';
import LogoutButton from '../components/LogoutButton';
import dayjs from 'dayjs';
import NextAvailable from './NextAvailable';
const dialog = {
  saveMessage: `By scheduling this reminder, you are agreeing to receive an sms text message up to 15 minutes prior to the chosen time.`,
  saveTitle: `You Have Scheduled an SMS Reminder`,
};

const SimpleForm = () => {
  const { formatReminder } = useCalendar();
  const { user } = useAuth0();
  const { name } = user;
  const { isMobile } = useSettingsContext();
  const { state } = useSocketContext();
  const { phone, timezone, scheduledReminder } = state;
  const defaultValues = {
    datetime: '',
    phone: phone || '',
    acceptTerms: '',
    utcdate: '',
    timezone: '',
    message: '',
    saveCalendar: false,
    rememberSetting: false,
  };
  const methods = useForm({ defaultValues: defaultValues || '' });
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const { saveReminder, saveCalendarReminder, sendVerificationSMS } = useFetch();
  const [dateScheduled, setDateScheduled] = useState('');
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
     if (getValues("saveCalendar") === true) {
      const datetime = getValues("datetime");
      const data = {
        day: dayjs(datetime).date(),
        month: dayjs(datetime).month(),
        year: dayjs(datetime).year(),
        time: dayjs(datetime).hour(),
        intention: 'SMS Reminder',
        receiveText: false
      };
      try {
        saveCalendarReminder(data);
        setValue("saveCalendar", false);
      } catch (err) {
        console.log("failed to save sms reminder to calendar: ", err)
      }
    }
    setDialogOpen(false);
    state.saveSuccess = false;
    setValue('datetime', '');
  };

  const handleSaveReminder = async (datetime, phone, timezone) => {
    // const newDate = new Date(datetime);
    try {
      await saveReminder(datetime, phone, timezone);
      setDateScheduled(datetime);
      await sendVerificationSMS(phone, datetime);
    } catch (err) {
      setDateScheduled('');
      console.log('Error saving reminder: ', err);
    }
  };

  const onSubmit = (data) => {
    const { datetime, message } = data;
    const adjustedTime = dayjs(datetime).set('minutes', 0).set('seconds', 0).set('milliseconds', 0).toDate();
    const zeroSeconds = new Date(datetime).setMilliseconds(0);
    const date = new Date(datetime);
    state['utcdate'] = date.toUTCString();
    handleSaveReminder(zeroSeconds, phone, timezone);
  };
  useEffect(
    () =>
      subscribe(state, () => {
        const callback = () => {
          if (state.saveSuccess) {
            setDialogOpen(true);
            state.scheduledReminder = true;
          }
        };
        const unsubscribe = subscribe(state, callback);
        callback();
        return unsubscribe;
      }),
    []
  );

  const handleChange = () => {};

  return (
    <>
      <LogoutButton sx={{ position: 'absolute', right: 0, mr: '5%' }} />

      <FormProvider {...methods}>
        <FormDialog
          control={control}
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
          reminder={formatReminder(dateScheduled)}
          message={dialog.saveMessage}
          title={dialog.saveTitle}
          // checkbox={true}
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
          }}
        >
          <Typography variant="h6" align="center" margin="dense" sx={{ fontWeight: 'bold' }}>
            EverybodyLeave Weekly Reminders
          </Typography>

          <Grid2 container spacing={{ xs: 2, md: 3 }} sx={{ width: '800px' }}>
            <Box
              px={3}
              py={2}
              sx={{ border: '2px solid black', borderRadius: '5px', width: isMobile ? '100%' : '45%', minWidth: '25%' }}
            >
              <Typography variant="h6" align="left" margin="dense" sx={{ fontWeight: 'bold' }}>
                Schedule a Reminder
              </Typography>
              <Grid2 size={12} sx={{ width: '100%', my: 2 }}>
                {user && <FormInputTel name="phone" control={control} label="Your Phone" />}
              </Grid2>
              <Grid2 size={12} sx={{ my: 1 }}>
                <FormInputDateTime name="datetime" control={control} label="Date/Time*" />
              </Grid2>
              {/* <Grid2 size={12} >
              <FormInputCheckBox  name="saveCalendar" label="save to calendar"/>
              </Grid2> */}
              {/* <Grid2 size={12} sx={{ mt: 2 }}>
                <FormInputText  name="message" control={control} label="Reminder Message" />
              </Grid2> */}
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
                <Reminders dateScheduled={dateScheduled}  />
              </Grid2>
            </Box>
            <Box sx={{ border: '2px solid black',
                borderRadius: '5px',
                width: isMobile ? '100%' : '45%',
                height: 300,}}>
            <Grid2 item size={12}>
            <NextAvailable/>
            </Grid2>
            </Box>
          </Grid2>
        </Box>
      </FormProvider>
    </>
  );
};
export default SimpleForm;
