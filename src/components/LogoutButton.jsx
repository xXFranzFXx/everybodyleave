import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Grid2, Box } from "@mui/material/";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return(  
     
            <Button onClick={() => logout()}>Log Out</Button>
  )
};
export default LogoutButton;