import { Fragment } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
// import { Outlet, Route } from "react-router";
import Loading  from "./Loading";

//HOC for protected routes 
//<ProtectedRoute path="/somePath" component={SomePrivateView}  />

import { Navigate, Outlet, useLocation } from 'react-router';

// const ProtectedRoute = ({ isAuthenticated, loginWithRedirect }) => {
//   const location = useLocation();

  // If not authenticated, redirect to login but save the current location
  // so we can send them back after they log in.
//   if (!isAuthenticated) {
//     return loginWithRedirect();
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

const ProtectedRoute = () => {
  const Component = withAuthenticationRequired(Outlet, {
    onRedirecting: () =>  <Loading/>
  });

  return <Component />;
};

export default ProtectedRoute;