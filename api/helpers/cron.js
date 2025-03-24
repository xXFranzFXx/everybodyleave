const schedule = require('node-schedule');
const { sendSms } = require('./twilio');
const { formatDateTime } = require('./dateTimeFormatter');

async function cronJob(data) {
    const { date, phone, smsMsg, time } = data; 
    const { cronExpression } = formatDateTime(date, time, 'cron');
    const job = schedule.scheduleJob(cronExpression, async () => {
        const { sid } = await sendSms(smsMsg, phone);
        await sid;
    })
    return job;
}

module.exports = { cronJob };