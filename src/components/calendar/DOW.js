import React from 'react';
import { Grid2 } from '@mui/material';

const DaysOfWeek = (props) => {
    return (
        <Grid2 container justifyContent="center" size={12}>
            <Grid2 sx={{ display: {xs: 'none', sm: 'block'} }} size="grow" />
            <Grid2 align="center" size="grow" className="calendar-days">
                <p style={{color: props.primaryColor}}>SUN</p>
            </Grid2>
            <Grid2 align="center" size="grow" className="calendar-days">
                <p style={{color: props.primaryColor}}>MON</p>
            </Grid2>
            <Grid2 align="center" size="grow" className="calendar-days">
                <p style={{color: props.primaryColor}}>TUE</p>
            </Grid2>
            <Grid2 align="center" size="grow" className="calendar-days">
                <p style={{color: props.primaryColor}}>WED</p>
            </Grid2>
            <Grid2 align="center" size="grow" className="calendar-days">
                <p style={{color: props.primaryColor}}>THU</p>
            </Grid2>
            <Grid2 align="center" size="grow" className="calendar-days">
                <p style={{color: props.primaryColor}}>FRI</p>
            </Grid2>
            <Grid2 align="center" size="grow" className="calendar-days">
                <p style={{color: props.primaryColor}}>SAT</p>
            </Grid2>
            <Grid2 sx={{ display: {xs: 'none', sm: 'block'} }} size="grow" />
        </Grid2>
    );
}

export default DaysOfWeek;