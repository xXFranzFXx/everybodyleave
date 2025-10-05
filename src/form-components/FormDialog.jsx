import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import { FormInputCheckBox } from './FormInputCheckBox';
import Box from '@mui/material/Box';

const FormDialog = ({ control, dialogOpen, handleDialogClose, reminder, message, title, checkbox }, props) => {
  return (
    <React.Fragment>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <Box
          sx={{ display: 'inline-flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}
        >
          <DialogContent sx={{ paddingBottom: 0 }}>
          <DialogTitle> {title} </DialogTitle>

           <DialogContentText> Date: {reminder}</DialogContentText>
            <Divider sx={{ my: 1 }} />

        
            <DialogContentText>{message}</DialogContentText>
            <Divider sx={{ my: 2 }} />
            <DialogActions>
           
            {checkbox && (
             
                    <FormInputCheckBox control={control} name="sendCalendar" label="save to calendar" />
              
              )} 

              <Button onClick={handleDialogClose}>Ok</Button>
            </DialogActions>
          </DialogContent>
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default FormDialog;
