import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { FormInputMultiCheckbox } from './FormInputMultiCheckbox';
import Typography from '@mui/material/Typography';

const FormDialog = ({ control, dialogOpen, handleDialogClose, getValues }, props) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  //allows a parent component to access child methods, we want to trigger the dialog component outside of it.

  return (
    <React.Fragment>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <Box sx={{ display: 'inline-flex' }}>
          <DialogTitle> You Have Scheduled an SMS Reminder !</DialogTitle>
          <DialogTitle align="right">        { getValues("datetime")}
</DialogTitle>
        </Box>
        <Divider sx={{ my: 1 }} />
        <DialogContent sx={{ paddingBottom: 0 }}>
          <Divider sx={{ my: 2 }} />
          <DialogContentText>
            By scheduling this reminder, you are agreeing to receive an sms text message up to 15 minutes prior to the
            chosen time.
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleDialogClose}>Ok</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default FormDialog;
