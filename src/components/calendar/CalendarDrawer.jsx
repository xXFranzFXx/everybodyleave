import { Box, Grid2, Typography, Divider, Drawer, Button } from '@mui/material';
import { FormInputText } from '../../form-components/FormInputText';
import { FormInputCheckBox } from '../../form-components/FormInputCheckBox';
import { FormInputRadio } from '../../form-components/FormInputRadio';
import { useForm } from 'react-hook-form';

const CalendarDrawer = ({ toggleDrawer, onSubmit, clickedDay, open, handleCancel, dayName, control, handleSubmit }) => {
   
    return (
     <Drawer
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
              <FormInputRadio clickedDay={clickedDay} control={control} name="time" label="time" />
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
        </Drawer>
    )
};
export default CalendarDrawer;