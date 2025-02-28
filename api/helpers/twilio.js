/* Uses twilio's message scheduling service.  code taken from :
https://www.twilio.com/en-us/blog/send-scheduled-sms-node-js-twilio
*/

// create a Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function sendScheduledSms(sendWhen, scheduleType, smsMsg, info) {
  // schedule message to be sent 61 minutes after current time
  // const sendWhen = new Date(new Date().getTime() + 61 * 60000);
 
  // send the SMS
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const message = await client.messages.create({
    from: messagingServiceSid,
    to: '+1xxxxxxxxxx',  // ← your phone number here
    body: smsMsg,
    scheduleType: scheduleType,
    sendAt: sendWhen.toISOString(),
  });

  console.log(message.sid);
  const { sid } = message;
  return sid;
}

async function sendScheduledVoice(){
  const call = await client.calls.create({
    from: "+14155551212",
    to: "+14155551212",
    // url: "http://demo.twilio.com/docs/classic.mp3",
    twml:"<Response><Say>This is your courtesy reminder from Everybody leave!</Say></Response>"
  });

  console.log(call.sid);
  const { sid } = call;
  return sid;
}

module.exports = { sendScheduledSms, sendScheduledVoice };
