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