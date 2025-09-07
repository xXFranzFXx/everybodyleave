import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Grid2, Box } from "@mui/material/";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return( 
    <Box>
      <Grid2 container spacing={{ xs: 2, md: 3 }} columnSpacing={{ xs: 12, sm: 10, md: 3 }}>
        <Grid2 item xs={12} sm={4}>
            <Button onClick={() => loginWithRedirect()}>Schedule A Reminder</Button>
        </Grid2>
      </Grid2>
      </Box>
  )
};
export default LoginButton;