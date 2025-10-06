const { Inngest, NonRetriableError } = require('inngest');
const inngest = new Inngest({ id: "weekly_reminders" });
const crypto = require('crypto');
const User = require('../models/UserModel');
const Event = require('../models/EventModel');
const SignedUpEvent = require('../models/SignedUpEventModel');
const EventBucket = require('../models/EventBucketModel');
const { textBeeBulkSms } = require('../helpers/textBee');

//since raw will already be stringified by inngest no need to do JSON.stringify on the payload here
function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  const signatureHash = signature.split('=')[1];
  
  return crypto.timingSafeEqual(
    Buffer.from(signatureHash),
    Buffer.from(digest)
  );
}

const textBeeWhFunction = inngest.createFunction(
  { id: "textBee-sms-received" },
  { event: "textBee/sms.received" },
  async ({ event, step }) => {
    const rawBody = await event.data;
    const signature = await event.headers['X-Signature'];
    console.log("rawBody: ", rawBody);
    console.log("signature: ", signature);
    //  if (!rawBody || !signature || !process.env.WEBHOOK_SECRET) {
    //   throw new Error("Missing required data for HMAC verification.");
    // }
 
     if (!verifyWebhookSignature(rawBody, signature, process.env.WEBHOOK_SECRET)) {
      throw new Error("Invalid Signature!");
  }
     const payload = await JSON.parse(rawBody);
     const { sender, message } = await payload;
      console.log("Webhook payload:", payload);

    // Your business logic here...
    await step.run("process-wh-data", async () => {
      console.log("sender is: ", sender);
      console.log("response is: ", message);
      // TODO: update user document and event document with the response received in this webhook
    });

    return { status: "success" };
  
 }
)
/**
 * Timezones: 
 * EST/New_York, 17:00/21:00UTC same day 19:00/23:00UTC same day
 * CST/Chicago,  17:00/22:00UTC same day 19:00/00:00UTC next day
 * MST/Denver, 17:00/23:00UTC same day 19:00/01:00UTC next day
 * PST/Los_Angeles/17:00/00:00UTC next day 19:00/02:00UTC next day, 
 * AKST/Anchorage, 17:00/01:00UTC next day 19:00/03:00UTC next day
 * HST/Honolulu 17:00/03:00UTC next day 19:00/05:00UTC next day
 */

const getFutureDate = (daysAhead) => {
  const today = new Date();
  const newDate = new Date(today.setDate(today.getDate() + daysAhead));
  console.log("newDate: ", newDate)
  const firstGroup = newDate.setHours(18,0,0,0);
  console.log("firstGroup: ", firstGroup)
  const secondGroup = newDate.setHours(20,0,0.0);
  
  return { firstGroup, secondGroup }
}

const getFutureTime =  (minutesAhead) => {
  const now = new Date()
  now.setHours(now.getHours() + 1, 0, 0, 0)
  // now.setMinutes(now.getMinutes() + minutesAhead);
  console.log("future time is: ", now)
  return now;
}

const isEmpty = (arr) => {
  return Array.isArray(arr) && arr.length === 0;
} 


const prepareReminders = inngest.createFunction(
  { id: "prepare-weekly-reminders" },
  [
    { cron: "TZ=America/Los_Angeles 0 0 * * 6"},
    // { cron: "TZ=America/New_York 0 0 * * 6"},
    // { cron: "TZ=America/Chicago 0 0 * * 6"},
    // { cron: "TZ=America/Denver 0 0 * * 6"},
    // { cron: "TZ=America/Anchorage 0 0 * * 6"},
    // { cron: "TZ=Pacific/Honolulu 0 0 * * 6"},
  ],
  async ({ step, event }) => {
    // create event documents in mongo db
    // console.log("event: ", event)
    // const regex = /(?<=TZ=)([^\s]+)/gm;
    // const str = event.data.cron;
    // console.log("cron: ", str)
    // let tz = regex.exec(str)
    // console.log("tz", tz[0])
    const weeklyReminders = await step.run(
      "create-reminders",
      async () => {
        const mon5 = getFutureDate(3).firstGroup;
        const mon7 = getFutureDate(3).secondGroup;
        const wed5 = getFutureDate(5).firstGroup;
        const wed7 = getFutureDate(5).secondGroup;
        const fri5 = getFutureDate(7).firstGroup;
        const fri7 = getFutureDate(7).secondGroup;
        const data = [
          {date: mon5, usersAttending: []},  
          {date: mon7, usersAttending: []},  
          {date: wed5, usersAttending: []},  
          {date: wed7, usersAttending: []},  
          {date: fri5, usersAttending: []},
          {date: fri7, usersAttending: []}  
        ]
        await Event.insertMany(data)  
            .then((result) => {
                  console.log("result ", result);
        })
          .catch(err => {
            console.error("error ", err);
        });
      });
      }
    );

/**
 * Get phone numbers of users for each event and send them to textbee to send a bulk reminder sms
 */
const sendBulkSms = inngest.createFunction(
  { id: "textbee-bulk-sms" },
  [
    { cron: "TZ=America/Los_Angeles 45 9,15,16,18 * * 1,3,5"},
  ],
  async ({ step, event }) => {
    const newTime = getFutureTime(15)
    const userList = await step.run(
      "get-users",
      async () => {
        const datetime = new Date();
        // datetime.setMinutes(datetime.getMinutes() + 15)
        console.log("inngest datetime: ", datetime)
        try {
        const agg = [
           {
              $match: {
                'date': newTime
              }
              },{
                $lookup: {
                  'from': 'users', 
                  'localField': 'usersAttending', 
                  'foreignField': '_id', 
                  'as': 'userDetails'
                }
                },{
                  $project: {
                    'userDetails.phone': 1
                  }
              }
        ];
      const cursor = await SignedUpEvent.aggregate(agg);
      // console.log("cursor: ", cursor);
      const eventId = await cursor[0]._id;

      const result = await cursor[0].userDetails;
      const phoneList = await result.map(user => user.phone);
      const message = "This is your scheduled reminder from EverybodyLeave. Respond with 1 if you will be participating, or 2 if you aren't."
      return { phoneList, message, eventId }
        } catch (err) {
           if (err.name === "TypeError") {
          throw new NonRetriableError("No users signed up for this event");
        }
        throw err;
        } 
  });
  

  if(userList){
    const { phoneList, message, eventId } = userList;
      await step.run("send-textbee-bulk-sms", 
        async () =>{
          console.log("sending phonelist to textBee")
          await textBeeBulkSms(message, phoneList);
          })
    }
  })

const functions = [
  // prepareReminders,
  textBeeWhFunction,
  sendBulkSms
];

module.exports = { inngest, functions }