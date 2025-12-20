const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

function range(start, end, step) {
  const length = Math.ceil((end - start) / step); // Calculate length, ensuring inclusivity for the end value
  return Array.from({ length }, (_, i) => start + i * step);
}

//if timezone is honolulu, and the reminder is at 7am, send nudge night before at 9pm
//otherwise set nudge times starting at 9am and for every other hour until 2 hours prior to reminder time
async function getNudgeReminders(datetime, timezone) {
  let nudgeTimes = [];
  let nudgeReminders = [];
  const reminderHour = dayjs(datetime).get('hour');
  // const firstNudge = dayjs(datetime).subtract(4, 'hour');
  const firstNudge = dayjs(datetime).hour(7).minute(0).second(0).millisecond(0);
  const secondNudge = dayjs(datetime).hour(12).minute(0).second(0).millisecond(0);
  const thirdNudge = dayjs(datetime).hour(15).minute(0).second(0).millisecond(0);
  const normalNudgeTimes = [firstNudge, secondNudge, thirdNudge];
  const firstNudgeHour = dayjs(firstNudge).get('hour');
  const currentHour = dayjs().get('hour');
  const diffHours = reminderHour - currentHour;

  console.log('reminderHour: ', reminderHour);
  console.log('firstNudgeHour: ', firstNudgeHour);
  if ((timezone === 'America/Honolulu' && reminderHour === 9) || (reminderHour === 10 && dayjs(datetime) > dayjs())) {
    //if the earliest timeslot is 10am or 9am set the nudgeReminder to the night before.
    const newDate = dayjs(datetime).subtract(13, 'hour').minute(0).second(0).millisecond(0).utc().format();
    console.log(`nudgeReminder for ${datetime} is ${newDate}`);
    nudgeReminders.push(newDate);
    return nudgeReminders;
  }
  if ((dayjs(datetime).date() > dayjs().date()) && reminderHour < 18 ) {
    console.log('normal nudgeTime: ', normalNudgeTimes);
    return normalNudgeTimes;
  }
  if (dayjs(datetime).date() === dayjs().date() && diffHours > 1 && diffHours < 4) {
    nudgeReminders.push(dayjs(datetime).subtract(2, 'hour'));
    console.log('nudgeReminders second condition: ', nudgeReminders);
    return nudgeReminders;
  }
  if (dayjs(datetime).date() === dayjs().date() && diffHours > 5) {
    nudgeTimes = range(currentHour, reminderHour, 3);
    nudgeReminders = nudgeTimes.map((time) => dayjs(datetime).hour(time));
    console.log('nudgeReminders 3rd if: ', nudgeReminders);

    return nudgeReminders;
  }
  console.log("no nudge reminders scheduled due to time constraints")
  return nudgeReminders
}

async function nudgeReminderTimestamps(datetime, timezone) {
  let timestamps = [];
  const nudgeReminders = await getNudgeReminders(datetime, timezone);
  timestamps = nudgeReminders.map((nudgeDate) => dayjs(nudgeDate).valueOf());
  return timestamps;
}

async function nudgeReminderContent(name, intention, datetime, timezone) {
  const nudgeReminders = await getNudgeReminders(datetime, timezone);
  if (timezone == 'America/Honolulu' && nudgeReminders.length == 1) {
    return `Good Evening ${name}! You have scheduled a reminder for tomorrow.  Your intention is to focus on ${intention}.`;
  } else {
    return `Hello ${name}! This is just a quick reminder that you have scheduled an event that takes place ${dayjs(
      datetime
    ).toDate()} to focus on ${intention}.`;
  }
}

async function convertToCsv(data) {
  const headers = Object.keys(data[0]);
  let csvRows = [];
  csvRows.push(headers.join(','));
  for (const row of data) {
    const values = headers.map((header) => row[header]);
    csvRows.push(values.join(','));
  }
  const csvString = csvRows.join('\n');
  console.log('csvString: ', csvString);
  const blob = new Blob([csvString], { type: 'text/csv' });
  const buf = await blob.arrayBuffer(); // Assuming 'data' is your Blob

  const fileName = 'httpsms-bulk.csv';
  const file = new File([blob], fileName, { type: blob.type });
  // Create a FormData object
  let formData = new FormData();
  formData.append('type', 'text/csv');
  formData.append('file', Buffer.from(buf), { filename: fileName });
  // formData.append("file", file, file.name); // 'file' is the field name on the server, 'data.csv' is the filename
  return formData;
}

async function createCsvObj(name, phone, intention, datetime, timezone) {
  let data = [];
  let dataRow = {};
  let sendAt = '';
  let content = '';
  const nudgeReminders = await getNudgeReminders(datetime, timezone);
  for (let i = 0; i < nudgeReminders?.length; i++) {
    sendAt = dayjs.utc(nudgeReminders[i]).tz(timezone).format('YYYY-MM-DDTHH:MM:ss');
    content = await nudgeReminderContent(name, intention, datetime, timezone);
    dataRow = {
      FromPhoneNumber: httpSmsPhone,
      ToPhoneNumber: phone,
      Content: content,
      SendTime: sendAt,
    };
    data.push(dataRow);
    dataRow = {};
    sendAt = '';
    content = '';
  }
  console.log('dataRows: ', data);
  return data;
}
module.exports = { getNudgeReminders, nudgeReminderContent, createCsvObj, convertToCsv, nudgeReminderTimestamps };
