import React, { useState, useEffect } from 'react';
import { FormInputDropdown } from '../form-components/FormInputDropdown';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, Controller } from 'react-hook-form';
import { useForm } from "react-hook-form";

import { TextField, FormControlLabel, Typography, Checkbox, Button, Grid2, Box, Paper } from '@mui/material';
export const Reminders = () => {
    const { state } = useSocketContext();
    const { reminders } = state;
    const methods = useForm({ defaultValues: defaultValues || ""});
    const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
    
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
                    Your Scheduled Reminders
                  </Typography>
                <Box px={3} py={2}>        
                  <Grid2 container spacing={{ xs: 2, md: 3 }} columnSpacing={{ xs: 12, sm: 10, md: 3 }}>
                  <Grid2 item xs={12} sm={4}>
                    { user &&          
                      <FormInputTel name="phone" control={control} label="Your Phone" />
                    }
                  </Grid2>
                  <Grid2 item xs={12} sm={4}>
                        <FormInputDropdown />
                    </Grid2>
                  </Grid2>
                  <Grid2 item xs={12} sm={4} style={{paddingTop: 15}} >
                    <FormInputText name="message" control={control} label="Message*" />
                  </Grid2>    
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
                </Box>     
              </Paper>   
              </>  
       
    )

} 

