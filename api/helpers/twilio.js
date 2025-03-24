
// create a Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

//send sms to specific phone number
async function sendSms( smsMsg, phone) {
  // send the SMS using twilio api
  const message = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER, 
    to: `1${phone}`,  
    body: smsMsg
  });

  console.log(message.sid);
  const { sid } = message;
  return sid;
}

/* The code below uses twilio's message scheduling service.  code taken from :
https://www.twilio.com/en-us/blog/send-scheduled-sms-node-js-twilio
*/
async function sendScheduledSms( smsMsg, phone, date) {
  // schedule message to be sent 61 minutes after current time using twilio programmable messaging api
  // const sendWhen = new Date(new Date().getTime() + 61 * 60000);
 
  // send the SMS
  const message = await client.messages.create({
    from: messagingServiceSid,
    to: `1${phone}`, 
    body: smsMsg,
    // scheduleType: scheduleType,
    sendAt: date.toISOString(),
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

module.exports = { sendScheduledSms, sendSms, sendScheduledVoice };
