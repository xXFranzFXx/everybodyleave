import React from 'react';
import { Grid2, Box, Typography, IconButton, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DaysOfWeek from './DOW';

const MonthBlock = (props) => {
    let newIntention = props.intention;

    if (window.innerWidth < 400) {
        // mobile
        if (props.intention.length >= 4) {
            newIntention = props.intention.substr(0, 4) + "...";
        }
    } else if (window.innerWidth < 600) {
        // xs view
        if (props.intention.length >= 10) {
            newIntention = props.intention.substr(0, 10) + "...";
        }
    } else if (window.innerWidth < 800) {
        // sm view
        if (props.intention.length >= 12) {
            newIntention = props.intention.substr(0, 12) + "...";
        }
    } else if (window.innerWidth < 1100) {
        // sm view
        if (props.intention.length >= 18) {
            newIntention = props.intention.substr(0, 18) + "...";
        }
    } else if (window.innerWidth < 1400) {
        if (props.intention.length >= 22) {
            newIntention = props.intention.substr(0, 22) + "...";
        }
    } else {
        if (props.intention.length >= 30) {
            newIntention = props.intention.substr(0, 30) + "...";
        }
    }

    const [intention, setIntention] = React.useState(newIntention);

    const updateDimensions = () => {

        let newIntention = props.intention;

        if (window.innerWidth < 400) {
            // mobile
            if (props.intention.length >= 4) {
                newIntention = props.intention.substr(0, 4) + "...";
            }
        } else if (window.innerWidth < 600) {
            // xs view
            if (props.intention.length >= 12) {
                newIntention = props.intention.substr(0, 10) + "...";
            }
        } else if (window.innerWidth < 800) {
            // sm view
            if (props.intention.length >= 12) {
                newIntention = props.intention.substr(0, 12) + "...";
            }
        } else if (window.innerWidth < 1100) {
            // sm view
            if (props.intention.length >= 18) {
                newIntention = props.intention.substr(0, 18) + "...";
            }
        } else if (window.innerWidth < 1400) {
            if (props.intention.length >= 22) {
                newIntention = props.intention.substr(0, 22) + "...";
            }
        } else {
            if (props.intention.length >= 30) {
                newIntention = props.intention.substr(0, 30) + "...";
            }
        }
        setIntention(newIntention);
    }

    React.useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    });

    if (props.dataDisplay === "circle") {
        return (
            <Grid2
                sx={{ height: { xs: '6px', sm: '12px', md: '20px' }, marginBottom: { xs: '3px', md: '5px' } }}
                size={2}>
                {props.completed && props.completed === true ? <CheckCircleIcon sx={{fontSize: {xs: '1.8vw', md: '1.5vw'}}} style={{color: props.color ? props.color : "#000000"}} /> : <CircleIcon sx={{fontSize: {xs: '1.8vw', md: '1.5vw'}}} style={{color: props.color ? props.color : "#000000"}} />}
            </Grid2>
        );
    } else if (props.dataDisplay === "list") {
        return (
            <Grid2
                sx={{paddingLeft: '1px', paddingRight: '2px', paddingBottom: '1px',  overflow: 'hidden', textOverflow: 'clip'}}
                size={12}>
                <Typography noWrap sx={{fontSize: { xs: '10px' } }} style={{paddingLeft: '2px', color: '#ffffff', backgroundColor: props.color ? props.color : "#000000", textAlign: 'left', textDecoration: props.completed ? 'line-through' : 'none', borderRadius: '2px'}}>{props.intention ? intention : ""}</Typography>
            </Grid2>
        );
    } else {
        return null;
    }
}

const CalendarItem = (props) => {
    const drawerRef = React.useRef(null)
    
    let dateNum;
    let color;
    let circleColor = props.secondaryColor;
    if (props.day) {
        dateNum = props.day.date;
        color = props.day.isInMonth ? props.primaryColor : "#aaaaaa";
        if (props.day.isToday) {
            color = props.secondaryColor;
            circleColor = props.primaryColor;
        }
    } else {
        return;
    }
   
    const handleClick = () => {
        if (props.day.isInMonth) {
            props.handleDayClick({
                "day": dateNum,
                "month": props.monthIndex,
                "year": props.currYear
            });
          
     
    }
        }
    return (
        <Paper onClick={handleClick} sx={{ height: { xs: '81px', md: '110px' } }} style={{ textAlign: 'center', borderRadius: '0px', color: color, border: '1px solid ' + props.primaryColor, backgroundColor: props.secondaryColor, width: '100%'}} >
            <Box  sx={{ height: { xs: '15px', sm: '20px', md: '25px' }, width: { xs: '15px', sm: '20px', md: '25px' }, fontSize: { xs: '10px', sm: '12px', md: '16px' } }} style={{borderRadius: '20px', backgroundColor: circleColor, margin: '3px'}}>         
                {dateNum}
               
            </Box>
            
            <Grid2 container sx={{ marginTop: { xs: '0px', sm: '0px' } }} style={{width: '100%'}}>
            {
                props.data ? props.data.map((block, index) => (
                    parseInt(block.day) === dateNum && props.day.isInMonth && parseInt(block.month) === props.monthIndex && parseInt(block.year) === props.currYear ? (<MonthBlock dataDisplay={props.dataDisplay} intention={block.intention} hours={block.hours} minutes={block.minutes} color={block.color} yPos={block.yPos} key={index} completed={block.completed} />) : null
                )) : null
            }
            </Grid2>
        </Paper>
    );
}

const CalendarRow = (props) => {

    return (
        <Grid2
            container
            spacing={0}
            display="flex"
            justifyContent="center"
            style={{width: '100%'}}
            size={12}>
            <Grid2 sx={{ display: {xs: 'none', sm: 'block'} }} size="grow" />
            <Grid2 size="grow">
                <CalendarItem dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} day={props.days[0]} handleDayClick={props.getDay} monthIndex={props.monthIndex} currYear={props.currYear} />
            </Grid2>
            <Grid2 size="grow">
                <CalendarItem dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} day={props.days[1]} handleDayClick={props.getDay} monthIndex={props.monthIndex} currYear={props.currYear} />
            </Grid2>
            <Grid2 size="grow">
                <CalendarItem dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} day={props.days[2]} handleDayClick={props.getDay} monthIndex={props.monthIndex} currYear={props.currYear} />
            </Grid2>
            <Grid2 size="grow">
                <CalendarItem dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} day={props.days[3]} handleDayClick={props.getDay} monthIndex={props.monthIndex} currYear={props.currYear} />
            </Grid2>
            <Grid2 size="grow">
                <CalendarItem dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} day={props.days[4]} handleDayClick={props.getDay} monthIndex={props.monthIndex} currYear={props.currYear} />
            </Grid2>
            <Grid2 size="grow">
                <CalendarItem dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} day={props.days[5]} handleDayClick={props.getDay} monthIndex={props.monthIndex} currYear={props.currYear} />
            </Grid2>
            <Grid2 size="grow">
                <CalendarItem dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} day={props.days[6]} handleDayClick={props.getDay} monthIndex={props.monthIndex} currYear={props.currYear} />
            </Grid2>
            <Grid2 sx={{ display: {xs: 'none', sm: 'block'} }} size="grow" />
        </Grid2>
    );
}

const MonthCalendar = (props) => {

    const today = new Date().getDate();
    const currMonth = new Date().getMonth()+1;
    const thisYear = new Date().getFullYear();

    // get current month by getting current month from date function
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const [monthIndex, setMonthIndex] = React.useState(props.month); 
    const [arrayOfDays, setArrayOfDays] = React.useState(Array(42)); // fill array with empty undefined elements
    const [currYear, setCurrYear] = React.useState(props.year); 

    const handleNextMonth = () => {
        if (monthIndex < 12) {
            props.setMonth(monthIndex + 1);
            setMonthIndex(monthIndex + 1);
        } else {
            props.setYear(props.year + 1);
            setCurrYear(props.year + 1);
            props.setMonth(1);
            setMonthIndex(1);
        }
    }

    const handlePrevMonth = () => {
        if (monthIndex > 1) {
            props.setMonth(monthIndex - 1);
            setMonthIndex(monthIndex - 1);
        } else {
            props.setYear(props.year - 1);
            setCurrYear(props.year - 1);
            props.setMonth(12);
            setMonthIndex(12);
        }
    }

    React.useEffect(() => {
        const getDaysOfMonth = () => {
            let month;
            if (monthIndex < 10) {
                month = '0'+monthIndex;
                console.log(month);
            } else {
                month = monthIndex;
            }

            let firstDayOfWeek = new Date(currYear + "-" + month + "-01").getDay(); // to tell which day of the week to start at
            const lastDay = new Date(currYear, month, 0).getDate(); // last number to end, days of month
            let updatedArrayOfDays = Array(42); // fill array with 42 empty values
            // based on days between Sunday to first day (lets say Thursday) we skip array at first 4 values
            const lastMonth = monthIndex-1;

            if (lastMonth < 10) {
                month = '0'+lastMonth;
            } else {
                month = lastMonth;
            }

            let lastDayOfLastMonth = new Date(currYear, month, 0).getDate(); // get last date of last month and count backwards to fill beginning of array
            for (let i = firstDayOfWeek; i >= 0 ; i--) {
                updatedArrayOfDays[i] = {
                    date: lastDayOfLastMonth,
                    isInMonth: false,
                    isToday: false,
                    events: [],
                    index: i
                }
                lastDayOfLastMonth--;
            }
    
            let count = 1;
            for (let i = firstDayOfWeek+1; i < 42; i++) {
                let isTodaysDate = false;
                if (monthIndex === currMonth && count === today && currYear === thisYear) {
                    isTodaysDate = true;
                }
                if (count > lastDay) {
                    break;
                } else {
                    updatedArrayOfDays[i] = {
                        date: count,
                        isInMonth: true,
                        isToday: isTodaysDate,
                        events: [],
                        index: i
                    }
                    count++;
                }
            }
    
            let newCount = 1;
            for (let i = count + firstDayOfWeek; i < 42; i++) {
                updatedArrayOfDays[i] = {
                    date: newCount,
                    isInMonth: false,
                    isToday: false,
                    events: [],
                    index: i
                }
                newCount++;
            }
    
            setArrayOfDays(updatedArrayOfDays);
            props.setDayArray(updatedArrayOfDays);
        }
        getDaysOfMonth();
    }, [currYear, monthIndex]);

    return (
        <Grid2 container>
            <Grid2
                container
                sx={{ marginLeft: { xs: '10px', sm: '0' }, marginRight: { xs: '10px', sm: '0' } }}
                size={12}>
                <Grid2 container style={{marginTop: '10px'}} size={12}>
                    <Grid2
                        align="right"
                        size={{
                            xs: 2,
                            sm: 3,
                            md: 4
                        }}>
                        <IconButton aria-label="delete" style={{ cursor: 'pointer', color: props.secondaryColor, height: "35px", width: "35px", backgroundColor: props.primaryColor}} onClick={handlePrevMonth} >
                            {
                                // Go to prev month
                            }
                            <ArrowBackIosNewIcon />
                        </IconButton>
                    </Grid2>
                    <Grid2
                        sx={{ textAlign: { xs: 'center' } }}
                        size={{
                            xs: 8,
                            sm: 6,
                            md: 4
                        }}>
                        <Typography variant="h5" sx={{ marginTop: { xs: '2px'} }} style={{color: props.primaryColor}}>{months[monthIndex-1]} {props.year}</Typography>
                    </Grid2>
                    <Grid2
                        align="left"
                        size={{
                            xs: 2,
                            sm: 3,
                            md: 4
                        }}>
                        <IconButton aria-label="delete" style={{ cursor: 'pointer', color: props.secondaryColor, height: "35px", width: "35px", backgroundColor: props.primaryColor}} onClick={handleNextMonth} >
                            {
                                // Go to next month
                            }
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Grid2>
                </Grid2>
                <Grid2
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    size={{
                        sm: 1
                    }} />
            </Grid2>
            <Grid2 style={{height: '10px'}} size={12} />
            <Grid2
                container
                sx={{ marginLeft: { xs: '10px', sm: '0' }, marginRight: { xs: '10px', sm: '0' } }}
                size={12}>
                <Grid2 container spacing={1} size={12}>
                    <DaysOfWeek primaryColor={props.primaryColor} />
                </Grid2>
                <Grid2 container spacing={1} size={12}>
                    <CalendarRow dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} days={arrayOfDays.slice(0, 7)} start={0} end={7} getWeek={props.handleClickWeek} getDay={props.handleClickDay} monthIndex={monthIndex} currYear={currYear} />
                </Grid2>
                <Grid2 container spacing={1} size={12}>
                    <CalendarRow dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} days={arrayOfDays.slice(7, 14)} start={7} end={14} getWeek={props.handleClickWeek} getDay={props.handleClickDay} monthIndex={monthIndex} currYear={currYear} />
                </Grid2>
                <Grid2 container spacing={1} size={12}>
                    <CalendarRow dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} days={arrayOfDays.slice(14, 21)} start={14} end={21} getWeek={props.handleClickWeek} getDay={props.handleClickDay} monthIndex={monthIndex} currYear={currYear} />
                </Grid2>
                <Grid2 container spacing={1} size={12}>
                    <CalendarRow dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} days={arrayOfDays.slice(21, 28)} start={21} end={28} getWeek={props.handleClickWeek} getDay={props.handleClickDay} monthIndex={monthIndex} currYear={currYear} />
                </Grid2>
                <Grid2 container spacing={1} size={12}>
                    <CalendarRow dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} days={arrayOfDays.slice(28, 35)} start={28} end={35} getWeek={props.handleClickWeek} getDay={props.handleClickDay} monthIndex={monthIndex} currYear={currYear} />
                </Grid2>
                <Grid2 container spacing={1} size={12}>
                    <CalendarRow dataDisplay={props.dataDisplay} data={props.data} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} days={arrayOfDays.slice(35, 42)} start={35} end={42} getWeek={props.handleClickWeek} getDay={props.handleClickDay} monthIndex={monthIndex} currYear={currYear} />
                </Grid2>
            </Grid2>
            <Grid2 style={{height: '100px'}} size={12} />
        </Grid2>
    );
}

export default MonthCalendar;