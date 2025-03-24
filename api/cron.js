const schedule = require('node-schedule');
const { sendSms } = require('./helpers/twilio')

function dateToCron(date, time) {
    const time = data.time;
    const re = /(\d+):(\d+)/g;
    const matches = re.exec(time);
    const hour = matches[0];
    const minute = matches[1];
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // Month is 0-indexed, so add 1
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
    const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    return cronExpression;
  }

async function cronJob(data) {
    const { date, phone, smsMsg, time } = data; 
    const { cronExpression } = dateToCron(date, time);
    const job = schedule.scheduleJob(cronExpression, async () => {
        const { sid } = await sendSms(smsMsg, phone);
        await sid;
    })
    return job;
}

module.exports = { cronJob };