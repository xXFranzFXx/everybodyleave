import React, { useState, createContext, useContext } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [primaryColor, setPrimaryColor] = useState('#000000');
    const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');
    const [dataDisplay, setDataDisplay] = useState('list');

    const changePrimaryColor = (color) => {
        setPrimaryColor(color.hex);
    };

    const changeSecondaryColor = (color) => {
        setSecondaryColor(color.hex);
    };

    const changeDataDisplay = (e) => {
        setDataDisplay(e.target.value);
    };

    return (
        <SettingsContext.Provider value={{
            primaryColor, 
            changePrimaryColor,
            secondaryColor,
            changeSecondaryColor,
            dataDisplay,
            changeDataDisplay,
            isMobile
        }}
        >
          { children }
        </SettingsContext.Provider>
    )
}

export function useSettingsContext () {
    const {  primaryColor, 
            setPrimaryColor,
            secondaryColor,
            setSecondaryColor,
            dataDisplay,
            setDataDisplay,
            phoneNumber,
            setPhoneNumber,
            isMobile } = useContext(SettingsContext);

            return {
                primaryColor, 
                setPrimaryColor,
                secondaryColor,
                setSecondaryColor,
                dataDisplay,
                setDataDisplay,
                phoneNumber,
                setPhoneNumber,
                isMobile
            }
}
export default SettingsProvider;