const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const dbName = 'otp-manager';
const collectionName = 'otp';
const nodemailer = require('nodemailer');
const { textBeeSms, textBeeReceiveSms } = require('../helpers/textBee');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

/* Generate a new otp */
router.post('/generateEmailOtp', function (req, res, next) {
  try {
    const client = new mongo(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(async (err) => {
      let otp;
      const expireAfterSeconds = 300;
      const db = await client.db(dbName);
      const index = await db.collection(collectionName).createIndex({ expireAt: 1 }, { expireAfterSeconds });
      const record = await db.collection(collectionName).findOne({ email: req.body.email });
      if (!!record) {
        console.log(`record : ${record}`);
        otp = record.otp;
      } else {
        otp = Math.floor(100000 + Math.random() * 900000);
        await db.collection(collectionName).insertOne({ email: req.body.email, expireAt: new Date(), otp });
      }
      console.log('connected to otp manager');

      let info = await transporter.sendMail({
        from: `${req.body.label} <no-reply@otpmanager.com>`, // sender address
        to: req.body.email, // list of receivers
        subject: `${req.body.label} - ${req.body.email}`, // Subject line
        html: `Your OTP has been generated below through ${req.body.label} <h2>${otp}</h2> <br/> <h4 style="color:red"><u>This otp will expire in ${expireAfterSeconds / 60} mins</u></h4>`, // html body
      });

      res.send('OTP has been sent to your email!');
      client.close();
    });
  } catch (e) {
    res.send(e);
  }
});

router.post('/generateSmsOtp',  function (req, res, next) {
    try {
      const client = new mongo(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      client.connect(async (err) => {
        let otp;
        const expireAfterSeconds = 300;
        const db = await client.db(dbName);
        const index = await db.collection(collectionName).createIndex({ expireAt: 1 }, { expireAfterSeconds });
        const record = await db.collection(collectionName).findOne({ phone: req.body.phone });
        if (!!record) {
          console.log(`record : ${record}`);
          otp = record.otp;
        } else {
          otp = Math.floor(100000 + Math.random() * 900000);
          await db.collection(collectionName).insertOne({ phone: req.body.phone, expireAt: new Date(), otp });
        }
        console.log('connected to otp manager');
  
        let info = await textBeeSms({
         phone: req.body.phone,
         message:`Your one time password is ${otp}. This will expire in ${expireAfterSeconds / 60} mins.` 
                });
  
        res.send('OTP has been sent to your sms device!');
        client.close();
      });
    } catch (e) {
      res.send(e);
    }
})



router.post('/verifyEmailOtp', function (req, res, next) {
  try {
    const client = new mongo(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(async (err) => {
      const db = await client.db(dbName);
      const record = await db.collection(collectionName).findOne({ email: req.body.email });
      if (!!record) {
        await db.collection(collectionName).deleteOne({ email: req.body.email });
        res.json('OTP Verified successfully!');
      } else {
        res.json('OTP Expired. Please try again');
      }
      client.close();
    });
  } catch (e) {
    res.send(e);
  }
});

router.post('/verifySmsOtp', function (req, res, next) {
    try {
      const client = new mongo(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      client.connect(async (err) => {
        const db = await client.db(dbName);
        const record = await db.collection(collectionName).findOne({ phone: req.body.phone });
        if (!!record) {
          await db.collection(collectionName).deleteOne({ phone: req.body.phone });
          res.json('OTP Verified successfully!');
        } else {
          res.json('OTP Expired. Please try again');
        }
        client.close();
      });
    } catch (e) {
      res.send(e);
    }
  });

module.exports = router;