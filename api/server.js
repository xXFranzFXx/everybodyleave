"use strict";

require('dotenv').config();
const path = require("path");
const URL = require('url').URL;
const express = require("express");
const cors = require("cors");
const { serve } = require("inngest/express");
const { inngest, functions } = require("./inngest/reminders");
const  connectDb  = require('./db/config/dbConfig');
const { dbConnection } = connectDb;

// const { cronJobEmail, cronJobTwilio, cronJobTextBee } = require('./helpers/cron');
const { textBeeSms } = require('./helpers/textBee');
const app = express();
const http = require("http").Server(app);
const corsOptions = {
  origin: ["*"],
  'Access-Control-Allow-Origin': ["*"],
  methods: ["OPTIONS", "GET", "POST"]
};

const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/events');
const calendarRoutes = require('./routes/calendarReminders');

app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(
  express.json({
    limit: '5mb',
  })
);


const staticPath = path.join(__dirname, "build");
const PORT = process.env.PORT || 4000;

const socketIO = require("socket.io")(http, {
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true
  },
    allowEIO3: true,
    transports: ['websocket', 'polling', 'flashSocket'],
    cors: {
      origin: ["https://everybodyleave-1.onrender.com", "http://localhost:3000", "http://localhost:3001"],
      'Access-Control-Allow-Origin': ["https://everybodyleave-1.onrender.com", "http://localhost:3000", "http://localhost:3001"],
      methods: ["OPTIONS", "GET", "POST"]
    },
    pingTimeout: 60000,
    maxHttpBufferSize: 2e8
});

app.use((req, res, next) => {
  req.io = socketIO;
  return next();
});

app.use('/api', userRoutes);
app.use('/api', eventRoutes);
app.use('/api', calendarRoutes);
app.use('/api/inngest', serve({ client: inngest, functions }));

socketIO.on("connection", socket => {
    console.log(`⚡: ${socket.id} user just connected!`);
    console.log(process.env.USER);
   
  // socket.on('sendTwilioSms', async (data) => {
  //   const { sid } = await cronJobTwilio(data);
  //   socket.emit('twilioSms', sid);
  // });

  // socket.on('sendTwilioVoice', async (data) => {
  //   const { sid } = await sendScheduledVoice(data);
  //   socket.emit('twilioVoice', sid);
  // });
  
  // socket.on('sendTextBeeCronSms', async (data) => {
  //   const { job } = await cronJobTextBee(data);
  //   socket.emit('textBeeSms', job);
  // });

  // socket.on('sendEmailCron', async (data) => {
  //   const { job } = await cronJobEmail(data);
  //   socket.emit('email', job);
  // });

  // socket.on('sendTest', async (data) => {
  //   const { test } = await cronJobTest(data);
  //   socket.emit('test', test)
  // });
  
  socket.on('sendTextBeeSms', async (data) => {
    // const smsMsg = 'this is your reminder';
    const { phone, message } = data;
    const { result } = await textBeeSms(message, phone);
    socket.emit('textBeeSms',result);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

  http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});