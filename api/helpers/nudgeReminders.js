const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { Readable } = require('stream'); 
const XLSX = require('xlsx');
const httpSmsPhone = process.env.HTTPSMS_PHONE;
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

function range(start, end, step) {
  const length = Math.ceil(Math.abs(end - start) / step); // Calculate length, ensuring inclusivity for the end value
  return Array.from({ length }, (_, i) => start + i * step);
}

//if timezone is honolulu, and the reminder is at 7am, send nudge night before at 9pm
//otherwise set nudge times starting at 9am and for every other hour until 2 hours prior to reminder time
async function getNudgeReminders(datetime, timezone) {
  let nudgeTimes = [];
  let nudgeReminders = [];
  const reminderHour = dayjs(datetime).get('hour');
  // const firstNudge = dayjs(datetime).subtract(4, 'hour');
  // const firstNudge = dayjs(datetime).hour(7).minute(0).second(0).millisecond(0);  //local
  const firstNudge = dayjs(datetime).subtract(9, 'h').utc().format(); //utc

  // const secondNudge = dayjs(datetime).hour(12).minute(0).second(0).millisecond(0);//local
  const secondNudge = dayjs(datetime).subtract(6, 'h').utc().format(); //utc

  // const thirdNudge = dayjs(datetime).hour(15).minute(0).second(0).millisecond(0);  //local
  const thirdNudge = dayjs(datetime).subtract(3, 'h').utc().format(); //utc

  const normalNudgeTimes = [firstNudge, secondNudge, thirdNudge];
  const firstNudgeHour = dayjs(firstNudge).get('hour');
  const currentHour = dayjs().get('hour');
  const x = dayjs(datetime);
  const y = dayjs();
  const diffHours = x.diff(y, 'hour');

  console.log('reminderHour: ', reminderHour);
  console.log('firstNudgeHour: ', firstNudgeHour);
  if ((timezone === 'America/Honolulu' && reminderHour === 18) || (reminderHour === 18 && dayjs(datetime) > dayjs())) {
    //if the earliest timeslot is 10am or 9am set the nudgeReminder to the night before.
    const newDate = dayjs(datetime).subtract(13, 'hour').minute(0).second(0).millisecond(0).utc().format();
    console.log(`nudgeReminder for ${datetime} is ${newDate}`);
    nudgeReminders.push(newDate);
    return nudgeReminders;
  }
  //if there is more than 24 hours between now and reminder time
  else if (x.date() > y.date() && diffHours > 8) {
    console.log('normal nudgeTime: ', normalNudgeTimes);
    return normalNudgeTimes;
  }
  //if reminder is scheduled on the same day within the next 5 hours, 1 nudgreminder is scheduled
  else if (x.date() === y.date() && (diffHours < 6 && diffHours > 1)) {
    nudgeReminders.push(dayjs(datetime).subtract(1, 'hour'));
    console.log('nudgeReminders second condition: ', nudgeReminders);
    return nudgeReminders;
  }
  //if reminder is scheduled on same day within next 8 hours, nudgereminders are scheduled 3 hours apart
  else if (x.date() === y.date() && (diffHours < 9  && diffHours > 4)) {
    nudgeTimes = range(currentHour, reminderHour, 3);
    nudgeReminders = nudgeTimes.map((time) => dayjs(datetime).hour(time));
    console.log('nudgeReminders 3rd condition: ', nudgeReminders);

    return nudgeReminders;
  } else {
    console.log('no nudge reminders scheduled due to time constraints');
    return nudgeReminders;
  }
}

async function nudgeReminderTimestamps(datetime, timezone) {
  let timestamps = [];
  const nudgeReminders = await getNudgeReminders(datetime, timezone);
  timestamps = nudgeReminders.map((nudgeDate) => dayjs(nudgeDate).valueOf());
  return timestamps;
}

async function nudgeReminderContent(name, intention, dateScheduled, datetime, timezone) {
  const nudgeReminders = await getNudgeReminders(datetime, timezone);
  const reminderDate = dayjs(datetime).date();
  const creationDate = dayjs().date()
  // const regex = creationDate < reminderDate ? /,.+/g : /\d.+/g ;
  // const regex =/(\d:.*)$/g
  const regex = /\d:.*$/gm;
  console.log("datetime: ", datetime)
  console.log("dateScheduled: ", dateScheduled)
  console.log("regex: ", regex)
  const reminderTimeStr = regex.exec(dateScheduled)[0];
  console.log("reminderTimeStr: ", reminderTimeStr)
  let message = '';
  if ((timezone == 'America/Honolulu' && nudgeReminders.length == 1) || ( dayjs(datetime).date() > dayjs().date() && nudgeReminders.length === 1 )) {
    message = `Good Evening ${name}! You have scheduled a reminder for tomorrow ${datetime}.  Your intention is to focus on ${intention}.`;
  } else if(dayjs(datetime).date() === dayjs().date()){
     message = `Hello ${name}! This is just a quick reminder that you have scheduled a leave that takes place ${dateScheduled}.`
  } else {
     message = `Hello ${name}! This is just a quick reminder that you have scheduled a leave that takes place today ${reminderTimeStr} to focus on ${intention}.`;

  }
  return message;
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
  return csvString;
} 

async function createCsvfile(csvString) {
  const  FormData  = require('form-data');

   const csvBuffer =  Buffer.from(csvString, 'utf-8');
    const form = new FormData();
   
    form.append('file', csvBuffer, {
        name: 'document',
        filename: 'httpsms-bulk.csv',
        contentType: 'text/csv',
    });
  return form;
}
async function convertCsvToXlsx(csvString) {
  const  FormData  = require('form-data');

  const workbook = XLSX.read(csvString, { type: 'string' });
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  console.log("created buffer: ", buffer.length)
  const fdata = new FormData();
  fdata.append('file', buffer, {
    filename: 'httpsms-bulk.xlsx',
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  // fdata.append('file', new File([buffer], 'sheetjs.xlsx'));
  return fdata;
}
async function convertToXlsx(jsonData) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const fileBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  const blob = new Blob([fileBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const fdata = new FormData();
  
  fdata.append("file", blob, "httpsms-bulk.xlsx")
  return fdata;
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
module.exports = { getNudgeReminders, nudgeReminderContent, createCsvObj, createCsvfile, convertCsvToXlsx, convertToXlsx, convertToCsv, nudgeReminderTimestamps };
