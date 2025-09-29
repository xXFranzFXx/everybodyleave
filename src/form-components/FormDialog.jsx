import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';


const FormDialog = ({ control, dialogOpen, handleDialogClose, reminder, message, title }, props) => {
  return (
    <React.Fragment>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <Box sx={{ display: 'inline-flex' }}>
          <DialogTitle> {title} </DialogTitle>
          <DialogTitle align="right"> {reminder}</DialogTitle>
        </Box>
        <Divider sx={{ my: 1 }} />
        <DialogContent sx={{ paddingBottom: 0 }}>
          <Divider sx={{ my: 2 }} />
          <DialogContentText>
            { message }
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
