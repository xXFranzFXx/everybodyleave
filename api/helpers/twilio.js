
// create a Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const { default: format } = require('date-fns/format');
const  formatDateTime  = require('./cron');
const client = require('twilio')(accountSid, authToken);

//send sms to specific phone number, gets called by cronjob
const sendTwilioSms = async ( smsMsg, phone) => {
  // send the SMS using twilio api
  const message = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER, 
    to: `${phone}`,  
    body: smsMsg
  });
  console.log(message.sid);
  const { sid } = message;
  return sid;
}

/* The code below uses twilio's message scheduling service. This doesn't require cronjobs. code taken from :
https://www.twilio.com/en-us/blog/send-scheduled-sms-node-js-twilio
*/
async function sendScheduledSms( smsMsg, phone, data) {
  // schedule message to be sent 61 minutes after current time using twilio programmable messaging api
  // const sendWhen = new Date(new Date().getTime() + 61 * 60000);
  const date = data.date;
  const time = data.time;
  const str = formatDateTime(date, time, 'iso');
  // send the SMS
  const message = await client.messages.create({
    from: messagingServiceSid,
    to: `1${phone}`, 
    body: smsMsg,
    // scheduleType: scheduleType,
    sendAt: str,
  });
  console.log(message.sid);
  const { sid } = message;
  return sid;
}

async function sendScheduledVoice(phone){
  const call = await client.calls.create({
    from: messagingServiceSid,
    to: phone,
    // url: "http://demo.twilio.com/docs/classic.mp3", 
    twml:"<Response><Say>This is your courtesy reminder from Everybody leave!</Say></Response>"
  });
  console.log(call.sid);
  const { sid } = call;
  return sid;
}

module.exports = { sendScheduledSms, sendTwilioSms, sendScheduledVoice };
