import React, { useState, useEffect, createContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'; 

  export const MetadataContext = createContext();
  const MetadataProvider = ({ children }) => {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [ reminders, setReminders ] = useState(null);
    const metadataKey = `${process.env.REACT_APP_AUTH0_DOMAIN}/claims/user_metadata`;
    const getUserMetadata = async () => {
    
        try {
          const token = await getAccessTokenSilently({
            audience: `${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
            scope: "read:current_user update:current_user_metadata",
          });
          const auth0Id = await user.sub
          const config = {
            method: 'get',
            url: `${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${auth0Id}?fields=user_metadata&include_fields=true`,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          };
          const response = await axios(config);
          const metadata = await response.data;
          const { reminders } = metadata["user_metadata"];
          
        } catch (err) {
          console.log("Error fetching user metadata", err);
        } 
   
    };
    useEffect(() => {
      getUserMetadata();
    }, [user]);
   
    return ( 
      <MetadataContext.Provider value={{reminders, useAuth0, getUserMetadata}}>
        {children}
      </MetadataContext.Provider>
    )
  }
export default MetadataProvider;