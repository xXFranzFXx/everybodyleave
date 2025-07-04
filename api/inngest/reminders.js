const { Inngest } = require('inngest');
const inngest = new Inngest({ id: "weekly_reminders" });
const User = require('../models/UserModel');
const Event = require('../models/EventModel');
const { textBeeBulkSms } = require('../helpers/textBee')
// This weekly digest function will run at 12:00pm on Friday in the Paris timezone
/*
Timezones: EST/New_York, CST/Chicago, MST/Denver, PST/Los_Angeles, AKST/Alaska, HST/Hawaii

*/
const getFutureDate = (daysAhead) => {
  const today = new Date();
  const newDate = new Date(today.setDate(today.getDate() + daysAhead));
  const firstGroup = newDate.setHours(0,0,0,0);
  const secondGroup = newDate.setHours(2,0,0.0);
  return { firstGroup, secondGroup }
}
const prepareReminders = inngest.createFunction(
  { id: "prepare-weekly-reminders" },
  { cron: "0 0 * * 6"},
  async ({ step }) => {
    // create event documents in mongo db
    const weeklyReminders = await step.run(
      "create-reminders",
      async () => {
        const mon5 = getFutureDate(2).firstGroup;
        const mon7 = getFutureDate(2).secondGroup;
        const wed5 = getFutureDate(4).firstGroup;
        const wed7 = getFutureDate(4).secondGroup;
        const fri5 = getFutureDate(6).firstGroup;
        const fri7 = getFutureDate(6).secondGroup;
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
      })
      }
    );

const sendBulkSms = inngest.createFunction(
  { id: "textbee-bulk-sms" },
  { cron: "TZ=America/Los_Angeles 45 16,18 * * 1,3,5"},
  async ({ step }) => {
    const userDetails = await step.run(
      "get-users",
      async () => {
        const datetime = new Date();
        datetime.setMinutes(datetime.getMinutes() + 15);
        const agg = [
           {
          $match: {
            'date': new Date(datetime)
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
      console.log("cursor: ", cursor);
      const result = await cursor[0].userDetails;
      console.log("result: ", result);
      const phoneList = await result.map(user => user.phone);
      const message = "This is your scheduled reminder from EBL. Respond with 1 if you will be participating, or 2 if you aren't."
      return { phoneList, message };  
  });

  await step.run("send-textbee-bulk-sms", 
    async () =>{
      const { phoneList, message } =  userDetails;
      await  await textBeeBulkSms(message, phoneList);
      })
  })

const functions = [
  prepareReminders,
  sendBulkSms
];

module.exports = { inngest, functions }