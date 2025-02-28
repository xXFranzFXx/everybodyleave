const schedule = require('node-schedule');
const sendScheduledSms = require('./twilio');

/* if we want to avoid using twilio scheduling api, we can send a scheduled text here, otherwise 
use this function for email and/or voice call */

async function scheduleNotification(socket, date, type, info) {
    const scheduledDate = new Date(date);
    switch (type) {
        case 'text' : {
            //send text at given date
            schedule.scheduleJob(scheduledDate, () => {
                socket.emit('text_sent');
            })
            break;
        }
        case 'email': {
           schedule.scheduleJob(scheduledDate, () => {
                //email task
             socket.emit('email_sent');
            })
            break;
        }
        case 'phone': {           
            schedule.scheduleJob(scheduledDate, () => {
                //voice call
               socket.emit('call_sent');
            })
            break;
        }
        default: 
    }
}

module.exports = { scheduleNotification };