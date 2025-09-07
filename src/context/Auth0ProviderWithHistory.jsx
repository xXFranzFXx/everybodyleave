import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  return (
    <Auth0Provider
       domain={process.env.REACT_APP_AUTH0_DOMAIN}
       clientId={process.env.REACT_APP_AUTH0_CLIENTID}
       authorizationParams={{
        // redirect_uri: window.location.origin,
        redirect_uri: `https://everybodyleave-2.onrender.com`,
        audience: `${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
        scope: "openid profile read:current_user update:current_user_metadata"
    }}
    >
      {children}
    </Auth0Provider>
  );
};
export default Auth0ProviderWithHistory;