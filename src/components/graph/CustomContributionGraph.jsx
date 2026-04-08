import React from 'react';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, getWeek, startOfMonth, endOfMonth, eachWeekOfInterval, addDays } from 'date-fns';

const YearlyView = ({ data, year }) => {
  const startDate = startOfYear(new Date(year, 0, 1));
  const endDate = endOfYear(new Date(year, 0, 1));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const contributions = data.reduce((acc, contrib) => {
    acc[contrib.date] = contrib.credit;
    return acc;
  }, {});

  const weeks = Array.from({ length: 53 }, () => Array(3).fill(null));
  const displayDays = [1, 3, 5]; // Monday, Wednesday, Friday

  days.forEach(day => {
    const dayOfWeek = getDay(day); // Sunday is 0, Monday is 1
    if (displayDays.includes(dayOfWeek)) {
      const weekIndex = getWeek(day, { weekStartsOn: 1 }) - 1; // ISO week, starts on Monday
      const dayIndex = displayDays.indexOf(dayOfWeek);
      const dateString = format(day, 'yyyy/MM/dd');

      if (weekIndex >= 0 && weekIndex < 53 && dayIndex !== -1) {
        weeks[weekIndex][dayIndex] = {
          date: dateString,
          credit: contributions[dateString] || 0,
        };
      }
    }
  });

  const monthLabels = Array(53).fill(null);
  days.forEach(day => {
    if (format(day, 'd') === '1') {
      const weekIndex = getWeek(day, { weekStartsOn: 1 }) - 1;
      if (weekIndex >= 0 && weekIndex < 53) {
        monthLabels[weekIndex] = format(day, 'MMM');
      }
    }
  });

  const getColor = (credit) => {
    if (credit > 20) return '#384259';
    if (credit > 10) return '#f73859';
    if (credit > 5) return '#7ac7c4';
    if (credit > 0) return '#c4edde';
    return '#f0f0f0';
  };

  const cellSize = 20; // Increased cell size
  const dayMargin = 4;
  const monthLabelHeight = 24;
  const weekLabelWidth = 40;
  const weekLabelMargin = 10;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: `${weekLabelMargin}px`, textAlign: 'right', flexShrink: 0, width: weekLabelWidth }}>
          <div style={{ height: monthLabelHeight }}></div>
          <div style={{ height: cellSize, marginBottom: dayMargin, lineHeight: `${cellSize}px` }}>Mon</div>
          <div style={{ height: cellSize, marginBottom: dayMargin, lineHeight: `${cellSize}px` }}>Wed</div>
          <div style={{ height: cellSize, marginBottom: dayMargin, lineHeight: `${cellSize}px` }}>Fri</div>
        </div>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', marginRight: dayMargin }}>
              <div style={{ fontSize: Math.max(8, cellSize / 2), height: monthLabelHeight, textAlign: 'center' }}>
                {monthLabels[weekIndex]}
              </div>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: day ? getColor(day.credit) : 'transparent',
                    marginBottom: dayMargin,
                    borderRadius: '4px',
                    border: day ? '1px solid rgba(0,0,0,0.1)' : 'none'
                  }}
                  title={day ? `${day.date}: ${day.credit} credits` : ''}
                ></div>
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

  const contributions = data.reduce((acc, contrib) => {
    acc[contrib.date] = contrib.credit;
    return acc;
  }, {});

  const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });

  const getColor = (credit) => {
    if (credit > 20) return '#384259';
    if (credit > 10) return '#f73859';
    if (credit > 5) return '#7ac7c4';
    if (credit > 0) return '#c4edde';
    return '#f0f0f0';
  };

  const cellSize = 40;
  const dayMargin = 5;
  const weekLabelWidth = 40;
  const weekLabelMargin = 10;

  const displayDays = [1, 3, 5]; // Monday, Wednesday, Friday
  const displayDayNames = ['Mon', 'Wed', 'Fri'];

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', marginRight: `${weekLabelMargin}px`, textAlign: 'right', flexShrink: 0, width: weekLabelWidth }}>
        {displayDayNames.map(name => (
          <div key={name} style={{ height: cellSize, marginBottom: dayMargin, lineHeight: `${cellSize}px` }}>{name}</div>
        ))}
      </div>
      <div style={{ display: 'flex'}}>
        {weeks.map((weekStart, weekIndex) => (
          <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', marginRight: dayMargin }}>
            {displayDays.map((dayOfWeek, dayIndex) => {
              const day = addDays(weekStart, dayOfWeek - 1);
              const dateString = format(day, 'yyyy/MM/dd');
              const credit = contributions[dateString] || 0;

              if (day.getMonth() !== month) {
                return <div key={dayIndex} style={{ width: cellSize, height: cellSize, marginBottom: dayMargin }}></div>;
              }

              return (
                <div
                  key={dayIndex}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getColor(credit),
                    marginBottom: dayMargin,
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '12px'
                  }}
                  title={`${dateString}: ${credit} credits`}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
        ))}
      </div>
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
