import React, { useState } from 'react';
import { format } from 'date-fns';
import CustomContributionGraph from './CustomContributionGraph';

const ContributionPage = () => {
  const contributionData = [
    { date: '2024/01/01', credit: 10 },
    { date: '2024/01/03', credit: 22 },
    { date: '2024/01/05', credit: 2 },
    { date: '2024/02/01', credit: 15 },
    { date: '2024/02/03', credit: 8 },
    { date: '2024/02/05', credit: 18 },
    { date: '2024/03/01', credit: 30 },
  ];

  const [view, setView] = useState('yearly');
  const [currentDate, setCurrentDate] = useState(new Date('2024-01-01T12:00:00'));

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="graph-page">
      <h1>Contribution Graph</h1>
      <div className="view-controls">
        <button onClick={() => setView('yearly')} className={view === 'yearly' ? 'active' : ''}>Yearly</button>
        <button onClick={() => setView('monthly')} className={view === 'monthly' ? 'active' : ''}>Monthly</button>
      </div>

      {view === 'monthly' && (
        <div className="month-navigator">
          <button onClick={handlePrevMonth}>&lt; Prev</button>
          <span>{format(currentDate, 'MMMM yyyy')}</span>
          <button onClick={handleNextMonth}>Next &gt;</button>
        </div>
      )}

      <CustomContributionGraph
        data={contributionData}
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        view={view}
      />
    </div>
  );
};

export default ContributionPage;
