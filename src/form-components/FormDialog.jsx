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
          <DialogTitle> {title} </DialogTitle>

          <DialogTitle> {reminder}</DialogTitle>

          <Divider />
          <DialogContent sx={{ paddingBottom: 0 }}>
            <Divider sx={{ my: 2 }} />
            <DialogContentText>{message}</DialogContentText>
            <Divider sx={{ my: 2 }} />
            <DialogActions>
              {checkbox && (
                <>
                  <Box sx={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    {/* <FormLabel >Save to calendar</FormLabel> */}
                    <FormInputCheckBox control={control} name="sendToCalendar" label="save to calendar" />
                  </Box>
                </>
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
