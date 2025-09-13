import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Grid2, Box, Fade } from "@mui/material/";
import image from '../assets/image'

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return( 
    <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'space-between', justifyContent: 'center', alignItems: 'center'}}>
      <Grid2 container spacing={{ xs: 2, md: 3 }} columnSpacing={{ xs: 12, sm: 10, md: 3 }}>
          <Grid2 item size={12} sx={{  marginTop: '80%',
                marginLeft:'38%'}}>
            <img  sx={{
                width: '100%',
                maxWidth: 280,
                minWidth: 230,
                height: 'auto',
                maxHeight: '180px',
                position: 'relative',
                paddingBottom: '20px',
                justifySelf: 'center',
              
                // top: 10,
              }} src={image.eblLogo} />
        </Grid2>
        <Grid2 item xs={12} sm={4} sx={{marginLeft: '25%'}} >
            <Button onClick={() => loginWithRedirect()}>Schedule A Reminder</Button>
        </Grid2>
      </Grid2>
      </Box>
  )
};
export default LoginButton;