import { useState, useEffect, useRef } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInputTel } from '../form-components/FormInputTel';
import { FormInputDateTime } from '../form-components/FormInputDateTime';
import { FormInputText } from '../form-components/FormInputText';
import { FormInputCheckBox } from '../form-components/FormInputCheckBox';
import { useSettingsContext } from '../context/SettingsProvider';
import { useAuth0 } from '@auth0/auth0-react';
import { subscribe } from 'valtio';
import { Typography, Button, Grid2, Box, Paper, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Reminders } from './Reminders';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useFetch from '../hooks/useFetch';
import useCalendar from '../hooks/useCalendar';
import FormDialog from '../form-components/FormDialog';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import NextAvailable from './NextAvailable';
import CalendarComponent from '../components/calendar/CalendarComponent';
import CalendarViewButton from '../components/calendar/CalendarViewButton';
dayjs.extend(utc);
dayjs.extend(timezone);
const dialog = {
  saveMessage: `By scheduling this reminder, you are agreeing to receive an sms text message up to 15 minutes prior to the chosen time.`,
  saveTitle: `You Have Scheduled an SMS Reminder`,
};

const SimpleForm = () => {
  
  const { formatReminder } = useCalendar();
  const { user } = useAuth0();
  const { name } = user;
  const { view } = useSettingsContext();
  const { isMobile } = useSettingsContext();
  const { state } = useSocketContext();
  const { phone, timezone, scheduledReminder, profileName, intention } = state;
  const defaultValues = {
    datetime: '',
    phone: phone || '',
    acceptTerms: '',
    utcdate: '',
    timezone: '',
    intention: '',
    intention2: '', 
    intention3: '',
    saveCalendar: false,
    rememberSetting: false,
  };
  const methods = useForm({ defaultValues: defaultValues  });
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    resetField,
    reset,
    formState: { errors },
  } = methods;
  const { saveReminder, saveCalendarReminder, sendVerificationSMS, sendConfirmationSMS, createNudgeReminders, createLeaveWorkflow } = useFetch();
  const [dateScheduled, setDateScheduled] = useState('');
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const inputRef = useRef("")
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

  };
  const handleSaveReminder = async (datetime, phone, timezone, intention) => {
    // const newDate = new Date(datetime);
    // const httpSmsData = { name: profileName, phone:phone, intention:intention, datetime: datetime, timezone: timezone }
    try {
      const reminder  = await saveReminder(datetime, phone, timezone);
      const nudgeTimeUtc = await reminder.date;
      setDateScheduled(datetime);

      // await sendVerificationSMS(phone, datetime, intention);
      // await sendInitialSMS(timezone, phone, datetime, intention)
      // await sendConfirmationSMS(timezone, phone, datetime, intention );
      // await createNudgeReminders(profileName, phone, intention, datetime, timezone);
      // console.log("datetime creating workflow: ", datetime)
      // console.log("before creating workflow: ", reminder)
       await createLeaveWorkflow(phone, datetime, timezone, intention, nudgeTimeUtc);
    } catch (err) {
      setDateScheduled('');
      console.log('Error saving reminder: ', err);
    }
  };
  
  const onSubmit = (data) => {
    const { datetime, intention, intention2 } = data;
    const adjustedTime = dayjs(datetime).minute(0).second(0).millisecond(0); 
    const localTime =  dayjs.utc(adjustedTime).format('YYYY-MM-DDTHH:MM:ss');
    console.log("local time: ", localTime)
     
    console.log("local time milliseconds: ", dayjs.utc(adjustedTime).tz(timezone).valueOf())

    const date = new Date(datetime);
    state['utcdate'] = date.toUTCString();
    console.log("utcdate: ", state['utcdate'])
    handleSaveReminder(adjustedTime, phone, timezone, intention || intention2);
    resetField("datetime");
    resetField("intention");
    resetField("intention2")
  };

  useEffect(
    
    () =>
   
      subscribe(state, () => {
        const callback = () => {
          if (state.saveSuccess) {
            resetField('intention')
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

          <Grid2 container spacing={{ xs: 2, md: 3 }} sx={{ width: '800px' }}>
          <Grid2 size={12} sx={{ display: 'flex', justifyContent: 'flex-end'}}>
          <CalendarViewButton/>
          </Grid2>
           { view === 'datepicker' && <>
            <Box
              px={3}
              py={2}
              sx={{ border: '2px solid black', borderRadius: '5px', width: '100%', minWidth: '25%' }}
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
              <Grid2 size={12} sx={{ mt: 2 }}>
                <FormInputText   ref={inputRef} name="intention" control={control} label="intention" />
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
                  // disabled={getValues("intention") === '' } 
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                  sx={{ width: '100%' }}
                >
                  Save
                </Button>
              </Grid2>
            
              {/* )} */}
                             <Grid2 item mt={3} size={12}>

               <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Schedule</Typography>
        </AccordionSummary>
        <AccordionDetails>
                       <Reminders dateScheduled={dateScheduled}  />

        </AccordionDetails>
      </Accordion>
      </Grid2>
      
           </Box>
           </>}
        {/* { view === 'calendar'  && 
          <CalendarComponent/>
        } */}
            {/* <Box
              px={1}
              py={2}
              sx={{
                border: '2px solid black',
                borderRadius: '5px',
                width: isMobile ? '100%' : '45%',
                height: '100%',
                maxHeight: 340,
                my: isMobile ? 3 : 0,
                overflowY: 'scroll',
              }}
            >
              <Grid2 item>
                <Reminders dateScheduled={dateScheduled}  />
              </Grid2>
            </Box> */}
            {/* <Box 
              px={1}
              py={2}
              sx={{ 
                border: '2px solid black',
                borderRadius: '5px',
                width: isMobile ? '100%' : '45%',
                height: 300}}>
            <Grid2 item size={12}>
            <NextAvailable handleSaveReminder={handleSaveReminder} onSubmit={onSubmit} getValues={getValues} control={control}/>
            </Grid2>
            </Box> */}
          </Grid2>
        </Box>
      </FormProvider>
    </>
  );
};
export default SimpleForm;
