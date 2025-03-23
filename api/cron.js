const schedule = require('node-schedule');
const { sendScheduledSms } = require('./helpers/twilio')

function dateToCron(date) {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // Month is 0-indexed, so add 1
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
    const cronExpression = `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
    return cronExpression;
  }

async function cronJob(data) {
    const { date, phone, smsMsg } = data; 
    const { cronExpression } = dateToCron(date);
    const job = schedule.scheduleJob(cronExpression, async () => {
        const { sid } = await sendScheduledSms(smsMsg, phone);
        await sid;
    })
    return job;
}

module.exports = { cronJob };