const { Inngest } = require('inngest');
const inngest = new Inngest({ id: "weekly_reminders" });
const User = require('../models/UserModel');
const Event = require('../models/EventModel');
const SignedUpEvent = require('../models/SignedUpEventModel');
const { textBeeBulkSms } = require('../helpers/textBee');
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
  const firstGroup = newDate.setHours(17,0,0,0);
  console.log("firstGroup: ", firstGroup)
  const secondGroup = newDate.setHours(19,0,0.0);
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
    { cron: "TZ=America/New_York 0 0 * * 6"},
    { cron: "TZ=America/Chicago 0 0 * * 6"},
    { cron: "TZ=America/Denver 0 0 * * 6"},
    { cron: "TZ=America/Anchorage 0 0 * * 6"},
    { cron: "TZ=Pacific/Honolulu 0 0 * * 6"},
  ],
  async ({ step, event }) => {
    // create event documents in mongo db
    console.log("event: ", event)
    const regex = /(?<=TZ=)([^\s]+)/gm;
    const str = event.data.cron;
    console.log("cron: ", str)
    let tz = regex.exec(str)
    console.log("tz", tz[0])
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
          {date: mon5, users: []},  
          {date: mon7, users: []},  
          {date: wed5, users: []},  
          {date: wed7, users: []},  
          {date: fri5, users: []},
          {date: fri7, users: []}  
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
    { cron: "TZ=America/Los_Angeles 45 16,18 * * 1,3,5"},
    { cron: "TZ=America/New_York 45 16,18 * * 1,3,5"},
    { cron: "TZ=America/Chicago 45 16,18 * * 1,3,5"},
    { cron: "TZ=America/Denver 45 16,18 * * 1,3,5"},
    { cron: "TZ=America/Anchorage 45 16,18 * * 1,3,5"},
    { cron: "TZ=Pacific/Honolulu 45 16,18 * * 1,3,5"},
  ],
  async ({ step, event }) => {
    const userDetails = await step.run(
      "get-users",
      async () => {
        const datetime = new Date();
        // datetime.setMinutes(datetime.getMinutes() + 15)
        console.log("inngest datetime: ", datetime)
        try {
        const agg = [
           {
              $match: {
                'date': getFutureTime(15)
              }
              },{
                $lookup: {
                  'from': 'users', 
                  'localField': 'users', 
                  'foreignField': '_id', 
                  'as': 'userDetails'
                }
                },{
                  $project: {
                    'userDetails.phone': 1
                  }
              }
        ];
      const cursor = await Event.aggregate(agg);
      // console.log("cursor: ", cursor);
      const result = await cursor[0].userDetails;
      const eventId = await cursor[0]._id;
      console.log("result: ", result);
      const phoneList = await result.map(user => user.phone);
      const message = "This is your scheduled reminder from Everybodyleave. Respond with 1 if you will be participating, or 2 if you aren't."
      return { phoneList, message, eventId }
        } catch (error) {
          console.log("Failed to find event, please make sure both date and time are correct: ", error);
          throw error
        }
  });
  if ( userDetails ) {
  const { phoneList, message, eventId } = userDetails;
    if (!isEmpty(phoneList)) {
      await step.run("send-textbee-bulk-sms", 
        async () =>{
          console.log("sending phonelist to textBee")
          await textBeeBulkSms(message, phoneList);
          });
        } else {
          await step.run("delete-ebl-event", 
            async () => {
              console.log("no users here.")
              await Event.deleteOne({ _id: eventId })
                .then((result) => {
                      console.log("Deleted empty event: ", result);
                  })
                    .catch(err => {
                      console.error("Error deleting event:  ", err);
                });
            })
        }
    }
  });

const functions = [
  prepareReminders,
  sendBulkSms
];

module.exports = { inngest, functions }