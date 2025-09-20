import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import utc from 'dayjs/plugin/utc';
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

const useCalendar = () => {
  dayjs.extend(LocalizedFormat)
  dayjs.extend(utc)
  dayjs.extend(calendar);
  const currentDate = dayjs();
  const customFormat = {
    sameDay: '[Today] [at] h:mm A',
    nextDay: '[Tomorrow] LLLL',
    nextWeek: '[Next]  LLLL',
    lastDay: '[Yesterday at] h:mm A',
    lastWeek: '[Last] LLLL',
    sameElse: 'DD[th of] MMMM YYYY [at] h:mm A',
  };

 const isInCurrentWeek = (date) => {
  const date1 = dayjs(); 
  const date2 = dayjs(date);
  return date1.isSame(date2, 'week');
 }
 
 const isInCurrentMonth = (date) => {
  const date1 = dayjs(); 
  const date2 = dayjs(date);
  return date1.isSame(date2, 'month');
 }
 
  const isBeforeNow = (date) => {  
    const checkDate = dayjs(date)
    return checkDate.isBefore(currentDate);
  };
  
  const isBetween = (start, end, target, options) => {
    return dayjs(target).isBetween(dayjs(start), dayjs(end), options);
  }

  const formatReminder = (date) => {
    return dayjs(date).calendar(currentDate, customFormat);
  }
  const formatDateTime = (date, hour) => {
   const dateTime = dayjs(date).hour(hour);
   return dateTime.utc().format();
  } 

  const checkDay = (date) => {
     const dayArr = [1, 3, 5];
     const weekday = dayjs(date).get('day')
     return (dayArr.includes(weekday) && isInCurrentMonth(date));
  }
  return {
    isBeforeNow,
    isBetween,
    formatReminder,
    formatDateTime,
    isInCurrentMonth,
    isInCurrentWeek,
    checkDay 
  }
}

export default useCalendar;