const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
    }
});
const sendEmail = async (email, smsMsg) => {

// Email content
    let mailOptions = {
        from: process.env.EMAIL_ACCOUNT,
        to: email,
        subject: 'EBL Reminder',
        text: smsMsg
    };

// Send email
  const sentEmail = await  transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
 return sentEmail;
}

module.exports = { sendEmail };