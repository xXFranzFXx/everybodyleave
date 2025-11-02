import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

const useCalendar = () => {
  dayjs.extend(LocalizedFormat)
  dayjs.extend(utc)
  dayjs.extend(calendar);
  dayjs.extend(duration)
  const currentDate = dayjs();
  const customFormat = {
    sameDay: '[Today] [at] h:mm A',
    nextDay: '[Tomorrow] LLLL',
    nextWeek: '[Next]  LLLL',
    lastDay: '[Yesterday at] h:mm A',
    lastWeek: '[Last] LLLL',
    sameElse: 'LLLL',
  };

 const isInCurrentWeek = (date) => {
  const date1 = dayjs(); 
  const date2 = dayjs(date);
  return date1.isSame(date2, 'week');
 }

 const isInSameWeek = (date1, date2) => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2).format();
  return d1.isSame(d2, 'week');
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
  
  const fifteenMinuteLimit = (reminder) => {
    const x = dayjs(reminder)
    const y = dayjs()

    const duration = dayjs.duration(x.diff(y)).asMinutes();
    return duration <= 15 
  }

  const checkDay = (date) => {
     const dayArr = [1, 3, 5];
     const weekday = dayjs(date).get('day')
     return (dayArr.includes(weekday) && isInCurrentMonth(date));
  }
  return {
    isBeforeNow,
    isBetween,
    isInSameWeek,
    formatReminder,
    formatDateTime,
    isInCurrentMonth,
    isInCurrentWeek,
    checkDay ,
    fifteenMinuteLimit
  }
}

export default useCalendar;