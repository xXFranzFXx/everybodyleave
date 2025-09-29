import React, { useState } from 'react';
import { Box, Grid2, Typography, Divider, Drawer, Button, FormLabel, IconButton } from '@mui/material';
import { FormInputText } from '../../form-components/FormInputText';
import { FormInputCheckBox } from '../../form-components/FormInputCheckBox';
import { FormInputRadio } from '../../form-components/FormInputRadio';
import { useCalendarContext } from '../../context/CalendarProvider';
import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';
import { FormInputSwitch } from '../../form-components/FormInputSwitch';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Countdown from '../timer/Countdown';
import useFetch from '../../hooks/useFetch';

const CalendarDrawerData = ({
  clickedId,
  toggleDrawer,
  onSubmit,
  clickedDay,
  dataDrawerOpen,
  dayName,
  control,
  handleSubmit,
  handleCancelData,
  isMobile,
}) => { 
  const { deleteCalendarReminder } = useFetch();
  const { times } = useCalendarContext();
  const { getValues, setValue } = useFormContext();
  const data = getValues('dayData');
  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleDeleteReminder = () => {
   
    try {
        deleteCalendarReminder(clickedId);
    } catch (err) {
        console.log("error deleting calendar reminder: ", err)
    }
  }

  const handleOnComplete = () => {
    console.log("countdown complete.")
  }
  const handleCancel = () => {
    if (isEditing) {
      return setIsEditing(false);
    } else {
      handleCancelData();
    }
  };
  const handleSave = () => {
    setIsEditing(false);
  };
  const getTimes = (time) => {
    return times?.filter((t) => t != time);
  };
  return (
    <Drawer
      PaperProps={{
        sx: {
          width: isMobile ? '55vw' : '35vw',
          pt: 10,
          px: 5,
        },
      }}
      open={dataDrawerOpen}
      onClose={toggleDrawer(false, 'hasData')}
      anchor={'right'}
    >
      <Box>
        <Grid2 container>
          {/* <Grid2 item size={12}>
            <Countdown
              duration={3600}
              colors={['#ff9248', '#a20000']}
              colorValues={[20, 10]}
              onComplete={handleOnComplete}
              isMobile={isMobile}
            />
          </Grid2> */}
          <Grid2 item size={6}>
            <Typography variant={isMobile ? 'h5' : 'h3'} sx={{ pb: isMobile ? 2 : 1, mt: 8 }}>
              { dayName.substring(0, 3) }
            </Typography>
          </Grid2>
          <Grid2 item size={6}>
            <Typography
              variant={isMobile ? 'h4' : 'h1'}
              sx={{ pb: isMobile ? 0 : 1, justifySelf: 'flex-end', fontSize: isMobile ? '4.75rem' : '8.5rem' }}
            >
              {clickedDay || ''}
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
      <Divider sx={{ mb: 5 }} />
      {data?.map((event, index) => (
        <>
          <Grid2 key={index} container direction="column">
            {isEditing ? (
              <>
                <Grid2 item size={12}>
                  <FormInputText editText={event.intention} control={control} name="intention" label="intention" />
                </Grid2>
              </>
            ) : (
              <>
                {' '}
                <Grid2 container direction="row">
                  <Grid2 item size={10}>
                    <FormLabel sx={{ fontWeight: 'bold' }}>Intention: </FormLabel>
                    <Typography
                      sx={{ pb: isMobile ? 0 : 1, justifySelf: 'flex-start', fontSize: isMobile ? '1.75rem' : '1rem' }}
                    >
                      {event.intention}
                    </Typography>
                  </Grid2>
                  <Grid2 item size={1}>
                    <IconButton size="large" color="primary" onClick={handleEdit}>
                      <EditNoteIcon />
                    </IconButton>
                  </Grid2>
                  <Grid2 item size={1}>
                    <IconButton size="large" color="primary">
                      <DeleteForeverIcon onClick={handleDeleteReminder}/>
                    </IconButton>
                  </Grid2>
                </Grid2>
              </>
            )}
            <Grid2 item size={12} sx={{ my: 4 }}>
              <FormLabel sx={{ fontWeight: 'bold' }}>Time: </FormLabel>
              {isEditing ? (
                <Grid2 item size={12} sx={{ my: 4 }}>
                  <FormInputRadio clickedDay={clickedDay} control={control} name="time" />
                </Grid2>
              ) : (
                <Typography
                  sx={{ pb: isMobile ? 0 : 1, justifySelf: 'flex-start', fontSize: isMobile ? '1.75rem' : '1rem' }}
                >
                  {dayjs().hour(event.time).minute(0).second(0).millisecond(0).format('h:mm A')}
                </Typography>
              )}
            </Grid2>
            {/* <Grid2 item size={12}>
              <FormInputCheckBox name="receiveText" label="receive sms reminder" control={control} />
            </Grid2> */}
            <Grid2 item size={12}>
              <FormInputSwitch name="completed" label="completed" setValue={setValue} />
            </Grid2>
          </Grid2>
          <Divider sx={{ my: 4 }} />
        </>
      ))}
      <Button sx={{ my: 1 }} disabled={!isEditing} variant="outlined" onClick={handleSubmit(onSubmit)}>
        Save
      </Button>
      <Button variant="outlined" onClick={handleCancel}>
        {isEditing ? 'Cancel' : 'Close'}
      </Button>
    </Drawer>
  );
};
export default CalendarDrawerData;
