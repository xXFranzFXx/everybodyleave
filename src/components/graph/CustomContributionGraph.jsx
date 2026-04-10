import React from 'react';
import { Grid2, Paper, Tooltip, Typography } from '@mui/material';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, getWeek, startOfMonth, endOfMonth, eachWeekOfInterval, addDays } from 'date-fns';
import { useSocketContext } from '../../context/SocketProvider';
const YearlyView = ({ data, year }) => {
  const { state } = useSocketContext();
  const { progress } = state;
  const startDate = startOfYear(new Date(year, 0, 1));
  const endDate = endOfYear(new Date(year, 0, 1));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const contributions = data?.reduce((acc, contrib) => {
    acc[contrib.date] = contrib.status;
    console.log("Acc: ", acc)
    return acc;
  }, {}) ;

  const weeks = Array.from({ length: 53 }, () => Array(7).fill(null));

  days.forEach(day => {
    const weekIndex = getWeek(day, { weekStartsOn: 0 }) - 1;
    const dayOfWeek = getDay(day);
    const dateString = format(day, 'yyyy/MM/dd');

    if (weekIndex >= 0 && weekIndex < 53) {
      weeks[weekIndex][dayOfWeek] = {
        date: dateString,
        status: contributions[dateString] || 0,
      };
    }
  });

  const getColor = (status) => {
   if (status === 'complete') return '#1976d2';
    // if (status > 10) return '#42a5f5';
    if (status === 'incomplete') return '#90caf9';
    if (status ==='no-show') return '#e3f2fd';
    return '#f5f5f5';
  };

  const monthLabels = Array.from({ length: 12 }).map((_, i) => format(new Date(year, i, 1), 'MMM'));

  const monthStartWeek = Array.from({ length: 12 }).map((_, i) => {
    return getWeek(startOfMonth(new Date(year, i, 1)), { weekStartsOn: 0 }) - 1;
  });

  const cellSize = 20;
  const cellMargin = 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', marginLeft: '35px' }}>
        {monthLabels.map((month, index) => {
          const startWeek = monthStartWeek[index];
          const endWeek = index === 11 ? 52 : monthStartWeek[index + 1] - 1;
          const width = (endWeek - startWeek + 1) * (cellSize + cellMargin);
          return <div key={month} style={{ width: `${width}px`, textAlign: 'left' }}><Typography variant="caption">{month}</Typography></div>
        })}
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginRight: '5px' }}>
          <Typography variant="caption" sx={{ height: `${cellSize}px`, marginBottom: `${cellMargin}px`, lineHeight: `${cellSize}px`, visibility: 'hidden' }}>Sun</Typography>
          <Typography variant="caption" sx={{ height: `${cellSize}px`, marginBottom: `${cellMargin}px`, lineHeight: `${cellSize}px` }}>Mon</Typography>
          <Typography variant="caption" sx={{ height: `${cellSize}px`, marginBottom: `${cellMargin}px`, lineHeight: `${cellSize}px`, visibility: 'hidden' }}>Tue</Typography>
          <Typography variant="caption" sx={{ height: `${cellSize}px`, marginBottom: `${cellMargin}px`, lineHeight: `${cellSize}px` }}>Wed</Typography>
          <Typography variant="caption" sx={{ height: `${cellSize}px`, marginBottom: `${cellMargin}px`, lineHeight: `${cellSize}px`, visibility: 'hidden' }}>Thu</Typography>
          <Typography variant="caption" sx={{ height: `${cellSize}px`, marginBottom: `${cellMargin}px`, lineHeight: `${cellSize}px` }}>Fri</Typography>
          <Typography variant="caption" sx={{ height: `${cellSize}px`, marginBottom: `${cellMargin}px`, lineHeight: `${cellSize}px`, visibility: 'hidden' }}>Sat</Typography>
        </div>
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', marginRight: `${cellMargin}px` }}>
              {week.map((day, dayIndex) => (
                <Tooltip title={day && day.status  ? `${day.date}: ${day.status}` : ''} key={dayIndex}>
                  <Paper
                    sx={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: day ? getColor(day.status) : '#f5f5f5',
                      border: '1px solid rgba(0,0,0,0.1)',
                      marginBottom: `${cellMargin}px`,
                    }}
                  />
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MonthlyView = ({ data, year, month }) => {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(new Date(year, month));

  const contributions = data?.reduce((acc, contrib) => {
    acc[contrib.date] = contrib.status;
    return acc;
  }, {}) ;

  const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 0 });

  const getColor = (status) => {
    console.log("status: ", status)
   if (status === 'complete') return '#1976d2';
    // if (status > 10) return '#42a5f5';
    if (status === 'incomplete') return '#90caf9';
    if (status ==='no-show') return '#e3f2fd';
    return '#f5f5f5';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginRight: '5px' }}>
        <Typography variant="caption" sx={{ height: '48px', lineHeight: '48px', visibility: 'hidden' }}>Sun</Typography>
        <Typography variant="caption" sx={{ height: '48px', lineHeight: '48px' }}>Mon</Typography>
        <Typography variant="caption" sx={{ height: '48px', lineHeight: '48px', visibility: 'hidden' }}>Tue</Typography>
        <Typography variant="caption" sx={{ height: '48px', lineHeight: '48px' }}>Wed</Typography>
        <Typography variant="caption" sx={{ height: '48px', lineHeight: '48px', visibility: 'hidden' }}>Thu</Typography>
        <Typography variant="caption" sx={{ height: '48px', lineHeight: '48px' }}>Fri</Typography>
        <Typography variant="caption" sx={{ height: '48px', lineHeight: '48px', visibility: 'hidden' }}>Sat</Typography>
      </div>
      <Grid2 container spacing={1} sx={{ justifyContent: 'center', width: 'auto' }}>
        {weeks.map((weekStart, weekIndex) => (
          <Grid2 item key={weekIndex}>
            <Grid2 container direction="column" spacing={1}>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = addDays(weekStart, dayIndex);
                const dateString = format(day, 'yyyy/MM/dd');
                const status = contributions[dateString] || 0;

                if (day.getMonth() !== month) {
                  return (
                    <Grid2 item key={dayIndex}>
                      <Paper sx={{ width: 40, height: 40, visibility: 'hidden', boxShadow: 'none', backgroundColor: 'transparent' }} />
                    </Grid2>
                  );
                }

                return (
                  <Grid2 item key={dayIndex}>
                    <Tooltip title={status ? `${dateString}: ${status}` : ''}>
                      <Paper
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: getColor(status),
                          border: '1px solid rgba(0,0,0,0.1)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">{format(day, 'd')}</Typography>
                      </Paper>
                    </Tooltip>
                  </Grid2>
                );
              })}
            </Grid2>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
};

const CustomContributionGraph = ({ data, year, month, view }) => {
  if (view === 'monthly') {
    return <MonthlyView data={data} year={year} month={month} />;
  }
  return <YearlyView data={data} year={year} />;
};

export default CustomContributionGraph;
