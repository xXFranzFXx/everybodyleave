const schedule = require('node-schedule');
const { sendTwilioSms } = require('./twilio');
const { textBeeSms } = require('./textBee');
const { sendEmail } = require('./emailer');

function formatDateTime(date, time, format) {
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
        case 'iso': {  //needed for twilio preprogram msg api
            return isoString; 
            break;
        }
        default: {
            return;
        }
    }
  }

async function cronJobTwilio(data) {
    const { date, phone, smsMsg, time } = data; 
    const str = formatDateTime(date, time, 'cron');
    const job = schedule.scheduleJob(str, async () => {
        const { sid } = await sendTwilioSms(smsMsg, phone);
        await sid;
    })
    return job;
}

async function cronJobTextBee(data) {
    const { date, phone, smsMsg, time } = data; 
    const str = formatDateTime(date, time, 'cron');
    const job = schedule.scheduleJob(str, async () => {
        const { result } = await textBeeSms(smsMsg, phone);
        await result;
    })
    return job;
}

async function cronJobEmail(data) {
    const { date, time,  email, smsMsg } = data;
    const str =formatDateTime(date, time, 'cron');
    const job = schedule.scheduleJob(str, async () => {
        const { sentEmail } = sendEmail(email, smsMsg);
        await sentEmail;
    })
    return job;
}

module.exports = { cronJobEmail, cronJobTwilio, cronJobTextBee, formatDateTime };