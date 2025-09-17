import { Box, Grid2, Typography, Divider, Drawer, Button, useTheme, useMediaQuery } from '@mui/material';
import { FormInputText } from '../../form-components/FormInputText';
import { FormInputCheckBox } from '../../form-components/FormInputCheckBox';
import { FormInputRadio } from '../../form-components/FormInputRadio';
import { useForm } from 'react-hook-form';

const CalendarDrawer = ({ toggleDrawer, onSubmit, clickedDay, open, handleCancel, dayName, control, handleSubmit }) => {
 const theme = useTheme();
 const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Drawer
      PaperProps={{
        sx: {
          width: isMobile? '55vw': '35vw',
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
            <Typography variant={isMobile? "h5" : "h3"} sx={{ pb: isMobile? 2 : 1, mt: 8 }}>
              {isMobile ? dayName.substring(0, 3) : dayName}
            </Typography>
          </Grid2>
          <Grid2 item size={6}>
            <Typography variant={isMobile? "h4": "h1"} sx={{ pb: isMobile? 0: 1, justifySelf: 'flex-end', fontSize: isMobile? '4.75rem': '8.5rem' }}>
              {  clickedDay  || "" }
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
          <FormInputRadio clickedDay={clickedDay} control={control} name="time" label="time" />
        </Grid2>
        <Grid2 item size={12}>
          <FormInputCheckBox name="receiveText" label="receive sms reminder" control={control} />
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
  );
};
export default CalendarDrawer;
