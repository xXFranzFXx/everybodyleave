import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import utc from 'dayjs/plugin/utc';

const useCalendar = () => {
  dayjs.extend(utc)
  dayjs.extend(calendar);
  const currentDate = dayjs();
  const customFormat = {
    sameDay: '[Today at] h:mm A',
    nextDay: '[Tomorrow at] h:mm A',
    nextWeek: '[Next] dddd [at] h:mm A',
    lastDay: '[Yesterday at] h:mm A',
    lastWeek: '[Last] dddd [at] h:mm A',
    sameElse: 'DD[th of] MMMM YYYY [at] h:mm A',
  };

  const now = dayjs();

  const isBeforeNow = (date) => {  
    const checkDate = dayjs(date)
    return checkDate.isBefore(now);
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
  return {
    isBeforeNow,
    isBetween,
    formatReminder,
    formatDateTime
  }
}

export default useCalendar;