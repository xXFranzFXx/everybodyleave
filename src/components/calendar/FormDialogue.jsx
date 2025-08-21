import  React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Box  from '@mui/material/Box';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import { FormInputRadio } from '../../form-components/FormInputRadio';
import { FormInputText } from '../../form-components/FormInputText';
import { FormProvider, useForm } from "react-hook-form";
const FormDialog = forwardRef((props, ref) => {
  const defaultValues = {
        intention:"",
        time:""
    }
  const methods = useForm({ defaultValues: defaultValues || ""});
  const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  function hitEscapeKey() {
  // Browser bug: can't use keyboard events, so we do it this way.
  // See https://tinyurl.com/mholrhv
  const escapeKey = document.createEvent("Events");
  escapeKey.initEvent("keydown", true, true);
  escapeKey.keyCode = 27;
  escapeKey.which = 27;
  document.dispatchEvent(escapeKey);
}
  const handleClose = () => {
    setOpen(false);
    props.setDay("")
    // setDayClicked("")
  };
  const handleCloseDialog = () => {
    setOpen(false)
  }
  //allows a parent component to access child methods, we want to trigger the dialog component outside of it.
  useImperativeHandle(ref, () => {
    return {
        handleClickOpen
    }
  });
 
  const handleSubmitClick = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    console.log(email);
    handleClose();
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
       
      </Button> */}
       <FormProvider {...methods}>
      <Dialog open={open} onClose={handleClose}>
        <Box sx={{display:'inline-flex'}}>
        <DialogTitle>Schedule a Reminder</DialogTitle>
        <DialogTitle align="right">{props.date.month}-{props.day}-{props.date.year} </DialogTitle>

        </Box>
       <Divider sx={{ my: 1 }} />

        <DialogContent sx={{ paddingBottom: 0 }}>
        
            <FormInputText control={control} name="intention" label="intention"/>
             <Divider sx={{ my: 2 }} />
            <FormInputRadio control={control} name="time" label="time"/>
                      <Divider sx={{ my: 2 }} />

              <DialogContentText>
           After choosing a time slot for your reminder, you will receive an sms text message up to 15 minutes prior to the chosen time.
          </DialogContentText>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" onClick={handleSubmit(handleSubmitClick)}>Save</Button>
            </DialogActions>
         
        </DialogContent>
      </Dialog>
                 

       </FormProvider>
    </React.Fragment>
  );
})

export default FormDialog;
