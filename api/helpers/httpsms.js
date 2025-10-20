const HttpSms = require('httpsms');
const client = new HttpSms(process.env.HTTPSMS_API_KEY)


async function sendScheduledHttpSMS(recipient, text, date) { 
    await client.messages.postSend({
        content: text,
        from: '+19132387124',
        to: recipient,
        sendAt: date
    })
    .then((message) => {
        console.log(message.id);
        return message;
    })
    .catch((err) => {
        console.error(err);
    });
}

module.exports = { sendHttpSMS }