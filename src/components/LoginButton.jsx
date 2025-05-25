import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material/node";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>Schedule A Reminder</Button>;
};

export default LoginButton;