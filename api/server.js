"use strict";

require('dotenv').config();
const path = require("path");
const URL = require('url').URL;
const express = require("express");
const cors = require("cors");
const { sms46Elks } = require('./helpers/46elks');
const { cronJobTwilio, cronJobTextBee } = require('./helpers/cron');
const app = express();
const http = require("http").Server(app);
const corsOptions = {
  origin: ["*"],
  'Access-Control-Allow-Origin': ["*"],
  methods: ["OPTIONS", "GET", "POST"]
};

app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

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
      origin: ["http://localhost:3000", "http://localhost:3001"],
      'Access-Control-Allow-Origin': ["http://localhost:3000", "http://localhost:3001"],
      methods: ["OPTIONS", "GET", "POST"]
    },
    pingTimeout: 60000,
    maxHttpBufferSize: 2e8
});

socketIO.on("connection", socket => {
    console.log(`⚡: ${socket.id} user just connected!`);
    console.log(process.env.USER);
    // console.log(process.env.NODE_ENV);
   
    // socket.on('notificationsToSocket', async () => {
    //   const { notifications } = await getNotifications();
    //   socket.emit('notifiactions', notifications);
    // });

    socket.on('sendTwilioSms', async (data) => {
      const { sid } = await cronJobTwilio(data);
      socket.emit('twilioSms', sid);
    })
   
  socket.on('send46ElksSms', async(data, param) => {
    const { phone } = data;
    const { smsSent } = await sms46Elks(phone, param);
    socket.emit('46ElksSms', smsSent);
  })
  
  socket.on('sendTextBeeSms', async (data) => {
    const { job } = await cronJobTextBee(data);
    socket.emit('textBeeSms', job);
  })

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });

});
  http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});