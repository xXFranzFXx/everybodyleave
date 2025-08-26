import  React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import dayjs from 'dayjs';

import { FormInputRadio } from '../../form-components/FormInputRadio';
import { FormInputText } from '../../form-components/FormInputText';
import { FormProvider, useForm } from "react-hook-form";
import { Typography } from '@mui/material/node';


export const  CalendarDrawer = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const defaultValues = {
        intention:"",
        time:""
  }
  const methods = useForm({ defaultValues: defaultValues || ""});
  const {  handleSubmit, register,  getValues, reset, control, setValue, formState: {errors} } = methods;
  const toggleDrawer = useCallback((newOpen) => () => {
    setOpen(newOpen);
  },[open]);
 useImperativeHandle(ref, () => {
     return {
         toggleDrawer
 
     }
   });
 
  const onSubmit = (data) => {
    toggleDrawer(false)
  }
  // const DrawerList = (
  //   <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
  //     <List>
  //       {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
  //         <ListItem key={text} disablePadding>
  //           <ListItemButton>
  //             <ListItemIcon>
  //               {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //             </ListItemIcon>
  //             <ListItemText primary={text} />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //     <Divider />
  //     <List>
  //       {['All mail', 'Trash', 'Spam'].map((text, index) => (
  //         <ListItem key={text} disablePadding>
  //           <ListItemButton>
  //             <ListItemIcon>
  //               {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //             </ListItemIcon>
  //             <ListItemText primary={text} />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //   </Box>
  // );

  return (
    <div>
   <FormProvider {...methods}>
      <Drawer 
        PaperProps={{
          sx: {
            width: '50vw',
            pt: 10,
            px: 5
          }
        }} 
        open={open} 
        onClose={toggleDrawer(false)} 
        anchor={"right"}
        >
        <Typography>
          Schedule a Reminder
        </Typography>
            <FormInputText control={control} name="intention" label="intention"/>
             <Divider sx={{ my: 2 }} />
            <FormInputRadio control={control} name="time" label="time"/>
            <Divider sx={{my: 2}}/>
            <Button onClick={handleSubmit(onSubmit)}>Save</Button>
         
      </Drawer>
      </FormProvider>
    </div>
  );
})