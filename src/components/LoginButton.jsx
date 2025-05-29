import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material/node";
import { Grid2 } from "@mui/material/node";
import { Paper } from "@mui/material/node";
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return( 
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
      <Grid2 container spacing={{ xs: 2, md: 3 }} columnSpacing={{ xs: 12, sm: 10, md: 3 }}>
        <Grid2 item xs={12} sm={4}>
            <Button onClick={() => loginWithRedirect()}>Schedule A Reminder</Button>
        </Grid2>
      </Grid2>
      </Paper>
  )
};
export default LoginButton;