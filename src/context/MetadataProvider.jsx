import React, { useState, useEffect, createContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'; 

  export const MetadataContext = createContext();
  const MetadataProvider = ({ children }) => {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const auth0Id = user?.sub;
    const [ reminders, setReminders ] = useState(null);
    const metadataKey = `${process.env.REACT_APP_AUTH0_DOMAIN}/claims/user_metadata`;
    const getUserMetadata = async () => {
        try {
          const token = await getAccessTokenSilently({
            audience: `${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
            scope: "openid profile read:current_user read:current_user_metadata update:current_user_metadata",
          });
            const config = {
            method: 'get',
            url: `${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${auth0Id}?fields=user_metadata&include_fields=true`,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          };
          const response = await axios(config);
          const metadata = await response.data;
          const { reminder } = metadata["user_metadata"];
          
        } catch (err) {
          console.log("Error fetching user metadata", err);
        } 
   
    };
  const saveUserReminder = async (reminder) => {
    const accessToken = await getAccessTokenSilently();
    const config = {
      method: 'patch',
      url: `${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${auth0Id}`,
      headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    data: JSON.stringify({
      "user_metadata": {
        "reminder": reminder,
      }
    })
}
    try { 
      const updateMetadata = await axios(config)
      const response = await updateMetadata.data;
      // setSavedMetadata(response);
      console.log("successfully updated metadata", response)
      return await response
    } catch(err) {
        console.log("error updating metadata", err)
        throw new Error(err);
        }
      
  }
    useEffect(() => {
      isAuthenticated && getUserMetadata();
    }, [user]);
   
    return ( 
      <MetadataContext.Provider value={{reminders, useAuth0, getUserMetadata, saveUserReminder}}>
        {children}
      </MetadataContext.Provider>
    )
  }
export default MetadataProvider;