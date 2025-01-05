/* Uses twilio's message scheduling service.  code taken from :
https://www.twilio.com/en-us/blog/send-scheduled-sms-node-js-twilio
*/

// create a Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function sendScheduledSms(sendWhen, scheduleType, message, info) {
  // schedule message to be sent 61 minutes after current time
  // const sendWhen = new Date(new Date().getTime() + 61 * 60000);
 
  // send the SMS
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const message = await client.messages.create({
    from: messagingServiceSid,
    to: '+1xxxxxxxxxx',  // ← your phone number here
    body: message,
    scheduleType: scheduleType,
    sendAt: sendWhen.toISOString(),
  });

  console.log(message.sid);
  return message.sid;
}

module.exports = { sendScheduledSms };
