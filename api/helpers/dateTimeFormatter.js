const formatDateTime = (date, time, format) => {
    const re = /(\d+):(\d+)/g;
    const matches = re.exec(time);
    const hour = matches[0];
    const minute = matches[1];
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // Month is 0-indexed, so add 1
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    const isoString = `${year}-${month}-${dayOfMonth}T${hour}:${minute}:00.00Z`;
    
    switch (format) {
        case 'cron': {
            return cronExpression;
            break;
        }
        case 'iso': {
            return isoString;
            break;
        }
        default : {
            return;
        }
    }
  }

 module.exports = { formatDateTime };