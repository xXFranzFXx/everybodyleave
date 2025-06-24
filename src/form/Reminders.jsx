import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FormInputDropdown } from '../form-components/FormInputDropdown';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, Controller } from 'react-hook-form';
import { useForm } from "react-hook-form";

import { TextField, FormControlLabel, Typography, Checkbox, Button, Grid2, Box, Paper } from '@mui/material';
export const Reminders = () => {
    const { state } = useSocketContext();
   
    const { user } = useAuth0();
    const { reminder } = user;
    // const methods = useForm({ defaultValues: defaultValues || ""});
    // const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
    
    const onDelete = () => {

    };
    const onEdit = () => {

    };
    return (
        <>
                <Paper
                    elevation={24}
                    style={{
                        display: "grid",
                        flexWrap: "wrap",
                        gridRowGap: "20px",
                        padding: "20px",
                        margin: "auto",
                        width: "auto",
                        maxWidth: "620px",
                        minWidth: "250px",
                        marginTop: "30px"
                    }} 
                >
                   <Typography variant="h6" align="center" margin="dense">
                   Upcoming Reminders
                  </Typography>
                <Box px={3} py={2}>        
                  <Grid2 container spacing={{ xs: 2, md: 3 }} columnSpacing={{ xs: 12, sm: 10, md: 3 }}>
              
                  <Typography variant="h6" align="center" margin="dense">
                  { user.reminder ? 
                   (new Date(user.reminder).toLocaleDateString() + '@' + new Date(user.reminder).toLocaleTimeString())
                   :
                   `There are no reminders.`
                  }
                  </Typography>
                  </Grid2>    
                  { user.reminder && 
                  <Box mt={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onDelete}
                    >
                      Delete
                    </Button>        
                     <Button
                      variant="contained"
                      color="primary"
                      onClick={onEdit}
                    >
                      Edit
                    </Button>    
                 
                  </Box>     
}
                </Box>     
              </Paper>   
              </>  
       
    )

} 

