import React, { useEffect, useCallback, useRef } from 'react';
import { FormInputRadio } from '../../form-components/FormInputRadio';
import { FormInputText } from '../../form-components/FormInputText';
// import Calendar from 'react-mui-calendar';
import { useAuth0 } from '@auth0/auth0-react';
import { useForm, FormProvider } from 'react-hook-form';
import { Grid2, Box, Drawer, Typography, Divider, Button } from '@mui/material';
import Calendar from './Calendar';
import { useCalendarContext } from '../../context/CalendarProvider';
import useCalendar from '../../hooks/useCalendar';
const testData = [
  {
    day: 3,
    month: 12,
    year: 2022,
    intention: 'Meeting',
    completed: true,
    color: 'red',
  },
  {
    day: 8,
    month: 12,
    year: 2025,
    intention: 'Class',
    completed: true,
    color: 'purple',
  },
  {
    day: 10,
    month: 12,
    year: 2025,
    intention: 'Event',
    completed: false,
    color: 'blue',
  },
  {
    day: 10,
    month: 12,
    year: 2025,
    intention: 'Party',
    completed: false,
    color: 'red',
  },
  {
    day: 11,
    month: 12,
    year: 2025,
    intention: 'Meeting',
    completed: true,
    color: 'green',
  },
  {
    day: 13,
    month: 12,
    year: 2025,
    intention: 'Work',
    completed: false,
    color: 'orange',
  },
  {
    day: 13,
    month: 12,
    year: 2025,
    intention: 'Event',
    completed: false,
    color: 'lightblue',
  },
  {
    day: 13,
    month: 12,
    year: 2025,
    intention: 'Class',
    completed: false,
    color: 'purple',
  },
  {
    day: 16,
    month: 12,
    year: 2025,
    intention: 'Dance',
    completed: true,
    color: 'darkgreen',
  },
  {
    day: 19,
    month: 12,
    year: 2025,
    intention: 'Class',
    completed: true,
    color: 'blue',
  },
  {
    day: 19,
    month: 12,
    year: 2025,
    intention: 'Meeting',
    completed: false,
    color: 'red',
  },
  {
    day: 22,
    month: 12,
    year: 2025,
    intention: 'Meeting',
    completed: true,
    color: 'red',
  },
  {
    day: 23,
    month: 12,
    year: 2025,
    intention: 'Class',
    completed: false,
    color: 'blue',
  },
  {
    day: 25,
    month: 12,
    year: 2025,
    intention: 'Christmas',
    completed: false,
    color: 'red',
  },
];

const CalendarComponent = () => {
  const { user: { mongoId } } = useAuth0();
  const defaultValues = {
    intention: '',
    time: '',
    day: '',
    month: '',
    year: '',
    status: 'upcoming',
    completed: false,
    color: '#0000FF'
  };

  const methods = useForm({ defaultValues: defaultValues || '' });
  const {
    handleSubmit,
    register,
    getValues,
    
    reset,
    control,
    setValue,
    formState: { errors },
  } = methods;
  const { formatDateTime } = useCalendar();
  const {  dates, events, times, daysOfMonth, availableDT, dtMap, getTimes  } = useCalendarContext();
  const [primaryColor, setPrimaryColor] = React.useState('#000000');
  const [secondaryColor, setSecondaryColor] = React.useState('#FFFFFF');
  const [dataDisplay, setDataDisplay] = React.useState('list');
  const [clickedDay, setClickedDay] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [radioOptions, setRadioOptions]= React.useState([])

   
  const radioRef = useRef();
  
  
  const handleClick = ({ day, month, year }) => {
    setClickedDay(day);
    setValue("day", day);
    setValue("month", month);
    setValue("year", year);
    
    if (daysOfMonth?.includes(day)) {
     setOpen(true)
    }
    
  };
 
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const changePrimaryColor = (color) => {
    setPrimaryColor(color.hex);
  };

  const changeSecondaryColor = (color) => {
    setSecondaryColor(color.hex);
  };

  const changeDataDisplay = (e) => {
    setDataDisplay(e.target.value);
  };

  const onSubmit = (data) => {
    const dateString = `${data.year}-${data.month}-${data.day}`
    const time = data.time;
    const dateTime = formatDateTime(dateString, time)
    console.log("dateTime: ", dateTime)
    setOpen(false);
  };
  const handleCancel = () => {
    setValue("time", "");
    setValue("intention", "")
    setOpen(false)
  }
  return (
    <div align="left">
      <FormProvider {...methods}>
        <Drawer
          PaperProps={{
            sx: {
              width: '50vw',
              pt: 10,
              px: 5,
            },
          }}
          open={open}
          onClose={toggleDrawer(false)}
          anchor={'right'}
        >
          <Box>
            <Grid2 container>
              <Grid2 item size={6}>
                <Typography variant="h5" sx={{ pb: 3, mt: 8 }}>
                    Schedule a Reminder
                </Typography>
              </Grid2>
              <Grid2 item size={6}>
                <Typography variant="h1" sx={{ pb: 3, justifySelf: 'flex-end' }}>
                  {clickedDay || ''}
                </Typography>
              </Grid2>
            </Grid2>
          </Box>
          <Divider sx={{ my: 5 }} />
          <Grid2 container direction="column">
            <Grid2 item size={12}>
              <FormInputText control={control} name="intention" label="intention" />
            </Grid2>
            <Grid2 item size={12} sx={{ my: 4 }}>
              <FormInputRadio ref={radioRef} clickedDay={clickedDay} control={control} name="time" label="time" />
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 2 }} />
          <Button sx={{ my: 1 }} variant="outlined" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Drawer>
      </FormProvider>
      <div style={{ height: '30px' }}></div>
      <Calendar
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        data={testData}
        dataDisplay={dataDisplay}
        handleClickDay={handleClick}
      />
    </div>
  );
};

export default CalendarComponent;
