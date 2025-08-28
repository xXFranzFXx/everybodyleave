import React from 'react';
import { FormInputRadio } from '../../form-components/FormInputRadio';
import { FormInputText } from '../../form-components/FormInputText';
// import Calendar from 'react-mui-calendar';
import { useForm, FormProvider} from 'react-hook-form';
import {Grid2, Drawer, Typography, Divider, Button} from '@mui/material';
import Calendar from './Calendar'

const testData = [
  {
    "day": 3,
    "month": 12,
    "year": 2022,
    "name": "Meeting",
    "completed": true,
    "color": "red"
  },
  {
    "day": 8,
    "month": 12,
    "year": 2025,
    "name": "Class",
    "completed": true,
    "color": "purple"
  },
  {
    "day": 10,
    "month": 12,
    "year": 2025,
    "name": "Event",
    "completed": false,
    "color": "blue"
  },
  {
    "day": 10,
    "month": 12,
    "year": 2025,
    "name": "Party",
    "completed": false,
    "color": "red"
  },
  {
    "day": 11,
    "month": 12,
    "year": 2025,
    "name": "Meeting",
    "completed": true,
    "color": "green"
  },
  {
    "day": 13,
    "month": 12,
    "year": 2025,
    "name": "Work",
    "completed": false,
    "color": "orange"
  },
  {
    "day": 13,
    "month": 12,
    "year": 2025,
    "name": "Event",
    "completed": false,
    "color": "lightblue"
  },
  {
    "day": 13,
    "month": 12,
    "year": 2025,
    "name": "Class",
    "completed": false,
    "color": "purple"
  },
  {
    "day": 16,
    "month": 12,
    "year": 2025,
    "name": "Dance",
    "completed": true,
    "color": "darkgreen"
  },
  {
    "day": 19,
    "month": 12,
    "year": 2025,
    "name": "Class",
    "completed": true,
    "color": "blue"
  },
  {
    "day": 19,
    "month": 12,
    "year": 2025,
    "name": "Meeting",
    "completed": false,
    "color": "red"
  },
  {
    "day": 22,
    "month": 12,
    "year": 2025,
    "name": "Meeting",
    "completed": true,
    "color": "red"
  },
  {
    "day": 23,
    "month": 12,
    "year": 2025,
    "name": "Class",
    "completed": false,
    "color": "blue"
  },
  {
    "day": 25,
    "month": 12,
    "year": 2025,
    "name": "Christmas",
    "completed": false,
    "color": "red"
  },
];

const CalendarComponent = () => {
  const defaultValues = {
          intention:"",
          time:""
    }
  const methods = useForm({ defaultValues: defaultValues || ""});
  const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
  const [primaryColor, setPrimaryColor] = React.useState("#000000");
  const [secondaryColor, setSecondaryColor] = React.useState("#FFFFFF");
  const [dataDisplay, setDataDisplay] = React.useState("circle");
  const [open, setOpen] = React.useState(false);
  const handleClick = ({ day, month, year }) => {
     setOpen(true)
  }
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const changePrimaryColor = (color) => {
    setPrimaryColor(color.hex);
  }

  const changeSecondaryColor = (color) => {
    setSecondaryColor(color.hex);
  }

  const changeDataDisplay = (e) => {
    setDataDisplay(e.target.value);
  }
  const onSubmit = (data) => {
    toggleDrawer(false)
  }
  return (
    <div align="left">
        <FormProvider  {...methods}>
         <Drawer 
             PaperProps={{
               sx: {
                 width: '50vw',
                 pt: 10,
                 px: 5
               }
             }} 
             open={open} 
             onClose={toggleDrawer(false)} 
             anchor={"right"}
             >
             <Typography sx={{pb:3}}>
               Schedule a Reminder
             </Typography>
                 <FormInputText control={control} name="intention" label="intention"/>
                  <Divider sx={{ my: 2 }} />
                 <FormInputRadio control={control} name="time" label="time"/>
                 <Divider sx={{my: 2}}/>
                 <Button onClick={handleSubmit(onSubmit)}>Save</Button>       
           </Drawer>
           </FormProvider>
      <div style={{height: '30px'}}></div>
      <Calendar 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor} 
        data={testData} 
        dataDisplay={dataDisplay}
        handleClickDay={handleClick}
      />
    </div>
  );
}

export default CalendarComponent;
