import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';


const FormDialogCancel = ({ dialogOpen, handleDialogClose }, props) => {
  return (
    <React.Fragment>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <Box sx={{ display: 'inline-flex' }}>
          <DialogTitle> You Have Cancelled an SMS Reminder </DialogTitle>
        </Box>
        <Divider sx={{ my: 1 }} />
        <DialogContent sx={{ paddingBottom: 0 }}>
          <Divider sx={{ my: 2 }} />
          <DialogContentText>
           This timeslot will remain available up to 15 minutes prior to the scheduled time.
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleDialogClose}>Ok</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default FormDialogCancel;
