import React, { useEffect, useCallback, useRef, useState } from 'react';
import { FormInputRadio } from '../../form-components/FormInputRadio';
import { FormInputText } from '../../form-components/FormInputText';
// import Calendar from 'react-mui-calendar';
import { useAuth0 } from '@auth0/auth0-react';
import dayjs from 'dayjs';
import { FormInputCheckBox } from '../../form-components/FormInputCheckBox';
import { FormInputMultiCheckbox } from '../../form-components/FormInputMultiCheckbox';
import { useForm, FormProvider } from 'react-hook-form';
import { useTheme, useMediaQuery } from '@mui/material';
import Calendar from './Calendar';
import { useCalendarContext } from '../../context/CalendarProvider';
import useCalendar from '../../hooks/useCalendar';
import useFetch from '../../hooks/useFetch';
import { DataThresholdingTwoTone } from '@mui/icons-material';
import CalendarDrawer from './CalendarDrawer';
import { useSocketContext } from '../../context/SocketProvider';

const testData = [
  {
    day: 3,
    month: 9,
    year: 2022,
    intention: 'Meeting',
    completed: true,
    color: 'red',
  },
  {
    day: 8,
    month: 9,
    year: 2025,
    intention: 'Class',
    completed: true,
    color: 'purple',
  },
  {
    day: 10,
    month: 9,
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
    month: 9,
    year: 2025,
    intention: 'Work',
    completed: false,
    color: 'orange',
  },
  {
    day: 13,
    month: 9,
    year: 2025,
    intention: 'Event',
    completed: false,
    color: 'lightblue',
  },
  {
    day: 3,
    month: 9,
    year: 2025,
    intention: 'Class',
    completed: false,
    color: 'purple',
  },
  {
    day: 16,
    month: 9,
    year: 2025,
    intention: 'Dance',
    completed: true,
    color: 'darkgreen',
  },
  {
    day: 19,
    month: 9,
    year: 2025,
    intention: 'Class',
    completed: true,
    color: 'blue',
  },
  {
    day: 21,
    month: 9,
    year: 2025,
    intention: 'Meeting',
    completed: false,
    color: 'red',
  },
  {
    day: 2,
    month: 9,
    year: 2025,
    intention: 'Meeting',
    completed: true,
    color: 'red',
  },
  {
    day: 23,
    month: 9,
    year: 2025,
    intention: 'Class',
    completed: false,
    color: 'blue',
  },
  {
    day: 25,
    month: 9,
    year: 2025,
    intention: 'Christmas',
    completed: false,
    color: 'red',
  },
];

const CalendarComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { state } = useSocketContext();
  const { hasHasSavedCalendar } = state;
  const { user } = useAuth0();
  const defaultValues = {
    intention: '',
    receiveText: false,
    time: '',
    day: '',
    month: '',
    year: '',
    status: 'upcoming',
    completed: false,
    color: '#0000FF',
    dayData: [],
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
  const { saveCalendarReminder, calendarData } = useFetch();
  const { formatDateTime, checkDay } = useCalendar();
  const { dates, events, times, daysOfMonth, availableDT, dtMap, getTimes } = useCalendarContext();
  const [primaryColor, setPrimaryColor] = React.useState('#000000');
  const [secondaryColor, setSecondaryColor] = React.useState('#FFFFFF');
  const [dataDisplay, setDataDisplay] = React.useState('list');
  const [clickedDay, setClickedDay] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [radioOptions, setRadioOptions] = React.useState([]);
  const [dayName, setDayName] = React.useState('');
  const [hasCancelledCalendar, setHasCancelledCalendar] = useState(false)
  const [itemData, setItemData] = []; 
  const [dataDrawerOpen, setDataDrawerOpen] = useState(false); 
  const radioRef = useRef();

  const handleClick = ({ day, month, year, hasData, data }) => {
   
    setClickedDay(day);
    setValue('day', day);
    setValue('month', month);
    setValue('year', year);
    setDayName(dayjs(`${year}-${month}-${day}`).format('dddd'));
    console.log('data: ', data);
    console.log("daysOfMonth: ", daysOfMonth)
    const date = dayjs(`${year}-${month}-${day}`);
    const weekday = dayjs(date).get('day')
            console.log("day: ", weekday )

      if (hasData) {
      setValue('dayData', data);
    }
    if (daysOfMonth?.includes(day) ) {
    //   console.log("daysOfMonth: ", daysOfMonth)
    //   console.log("day: ", day)
      setOpen(true);
    }
  
  };

  const toggleDrawer = (newOpen, type) => () => {
    switch (type) {
        case 'empty': {
            setOpen(newOpen);
        }
        case 'hasData': {
            setDataDrawerOpen(newOpen);
        }
    }
   
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
    saveCalendarReminder(data);
    state.hasSavedCalendar = true;
    setOpen(false);
  };
  const handleCancel = () => {
    setValue('time', '');
    setValue('intention', '');
    setValue('receiveText', '');
    setOpen(false);
  };
  return (
    <div align="left">
      <FormProvider {...methods}>
        <CalendarDrawer
          isMobile={isMobile}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          clickedDay={clickedDay}
          open={open}
          dayName={dayName}
          toggleDrawer={toggleDrawer}
          handleCancel={handleCancel}
        />
        {/* <Drawer
          PaperProps={{
            sx: {
              width: '35vw',
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
                <Typography variant="h3" sx={{ pb: 1, mt: 8 }}>
                   { dayName }
                </Typography>
              </Grid2>
              <Grid2 item size={6}>
                <Typography variant="h1" sx={{ pb: 1, justifySelf: 'flex-end', fontSize: '8,5rem' }}>
                  {clickedDay || ''}
                </Typography>
              </Grid2>
            </Grid2>
          </Box>
          <Divider sx={{ mb: 5 }} />
          <Grid2 container direction="column">
            <Grid2 item size={12}>
              <FormInputText control={control} name="intention" label="intention" />
            </Grid2>
            <Grid2 item size={12} sx={{ my: 4 }}>
              <FormInputRadio ref={radioRef} clickedDay={clickedDay} control={control} name="time" label="time" />
            </Grid2>
            <Grid2 item size={12}>
                <FormInputCheckBox name="receiveText" label="receive sms reminder" control={control}/>
            </Grid2>
          </Grid2>
        
          <Divider sx={{ my: 2 }} />
          <Button sx={{ my: 1 }} variant="outlined" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Drawer> */}
      </FormProvider>
      <div style={{ height: '30px' }}></div>
      <Calendar
        isMobile={isMobile}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        data={calendarData ?? testData}
        dataDisplay={dataDisplay}
        handleClickDay={handleClick}
      />
    </div>
  );
};

export default CalendarComponent;
