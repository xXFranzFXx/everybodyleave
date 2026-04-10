import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import CustomContributionGraph from './CustomContributionGraph';
import { useSocketContext } from '../../context/SocketProvider';
import useFetch from '../../hooks/useFetch';
const ContributionPage = () => {
  const { state } = useSocketContext();
  const { getProgress } = useFetch();
  const [graphData, setGraphData] = useState([])
 useEffect(() => {
  const userProgress = async () => {
    const data = await getProgress();
    setGraphData([...data]);
  }
  userProgress();
 },[])

  const contributionData = [
   { date: '2026-03-14', credit: 0 },
  { date: '2026-03-17', credit: 0 },
  { date: '2026-03-18', credit: 0 },
  { date: '2026-03-20', credit: 0 },
  { date: '2026-03-26', credit: 2 },
  { date: '2026-03-28', credit: 1 },
  { date: '2026-04-02', credit: 0 },
  { date: '2026-04-08', credit: 2 }
  ];

  const [view, setView] = useState('yearly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Your Progress
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ButtonGroup variant="contained">
          <Button onClick={() => setView('yearly')} disabled={view === 'yearly'}>Yearly</Button>
          <Button onClick={() => setView('monthly')} disabled={view === 'monthly'}>Monthly</Button>
        </ButtonGroup>
      </Box>

      {view === 'monthly' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <Button onClick={handlePrevMonth}>&lt; Prev</Button>
          <Typography variant="h6" component="span" sx={{ mx: 2 }}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <Button onClick={handleNextMonth}>Next &gt;</Button>
        </Box>
      )}

      <CustomContributionGraph
        data={graphData}
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        view={view}
      />
    </Box>
  );
};

export default ContributionPage;
