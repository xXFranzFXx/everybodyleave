import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FormInputDropdown } from '../form-components/FormInputDropdown';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider, Controller } from 'react-hook-form';
import { useForm } from "react-hook-form";
import axios from 'axios';

import { TextField, FormControlLabel, Typography, Checkbox, Button, Grid2, Box, Paper } from '@mui/material';
export const Reminders = () => {
    const { state } = useSocketContext();
    const { phone, timezone } = state;
    const { user, getAccessTokenSilently } = useAuth0();
    const { reminderDate, mongoId } = user;
    const [ displayedDate, setDisplayedDate] = useState(null);
    // const methods = useForm({ defaultValues: defaultValues || ""});
    // const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
    const isBeforeNow = (date) =>  {
    return new Date(date) < new Date();
  }
    const onDelete = async () => {
     const token = await getAccessTokenSilently();
     
     console.log("mongoId: ", mongoId)
     try {
             const response = await axios({
                    method: 'PUT',
                    url: `http://localhost:4000/api/events/cancel`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data:{
                      mongoId: mongoId,
                      phone: phone,
                      datetime: new Date(reminderDate), 
                      timezone: timezone
                    }
                })
                const res = await response.data;
                
                return res;
              } catch (err) {
                console.log("Error cancelling reminder: ", err)
              }
          
    };
  
    const onEdit = () => {

    };
    useEffect (() => {
      setDisplayedDate(reminderDate);
    },[reminderDate])
    return (
        <>
        { displayedDate != null && 
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
                   { isBeforeNow(displayedDate) ? 'Past Reminders' : 'Upcoming Reminders' }
                  </Typography>
                <Box px={3} py={2}>        
                  <Grid2 container spacing={{ xs: 2, md: 3 }} columnSpacing={{ xs: 12, sm: 10, md: 3 }}>
              
                  <Typography variant="h6" align="center" margin="dense">
                  { displayedDate ? 
                   (new Date(displayedDate).toLocaleDateString('en-EN', { weekday: 'long' })+' '+new Date(displayedDate).toLocaleDateString() +' ' +'@' + new Date(reminderDate).toLocaleTimeString())
                   :
                   `There are no reminders.`
                  }
                  </Typography>
                  </Grid2>    
                  { displayedDate && !isBeforeNow(displayedDate) &&
                  <Box mt={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onDelete}
                    >
                      Delete
                    </Button>        
                     {/* <Button
                      variant="contained"
                      color="primary"
                      onClick={onEdit}
                    >
                      Edit
                    </Button>     */}
                   
                  </Box>     
}
                </Box>     
              </Paper>   
}
              </>  
       
    )

} 

