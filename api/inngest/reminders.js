const { Inngest } = require('inngest');
const inngest = new Inngest({ id: "445_reminders" });
const User = require('../models/UserModel');
const Event = require('../models/EventModel');

// This weekly digest function will run at 12:00pm on Friday in the Paris timezone

const getFutureDate = (daysAhead) => {
  const today = new Date();
  return new Date(today.setDate(today.getDate() + daysAhead));
}
const prepareReminders = inngest.createFunction(
  { id: "prepare-weekly-reminders" },
  { cron: "TZ=America/Los_Angeles 0 0 * * 6"},
  async ({ step }) => {
    // create event documents in mongo db
    const weeklyReminders= await step.run(
      "create-reminders",
      async () => {
        const mon = getFutureDate(2);
        const wed = getFutureDate(4);
        const fri = getFutureDate(6);
        const data = [
          {date: mon, firstGroup:[], secondGroup:[]},  
          {date: wed, firstGroup:[], secondGroup:[]},  
          {date: fri, firstGroup:[], secondGroup:[]} 
        ]
        await Event.insertMany(data)  
            .then((result) => {
                  console.log("result ", result);
                  // res.status(200).json({'success': 'new documents added!', 'data': result});
        })
          .catch(err => {
            console.error("error ", err);
            // res.status(400).json({err});
        });
      })
      }
    );

    // 💡 Since we want to send a weekly digest to each one of these users
    // it may take a long time to iterate through each user and send an email.

    // Instead, we'll use this scheduled function to send an event to Inngest
    // for each user then handle the actual sending of the email in a separate
    // function triggered by that event.

    // ✨ This is known as a "fan-out" pattern ✨

    // 1️⃣ First, we'll create an event object for every user return in the query:
//     const events = users_A.map((user) => {
//       return {
//         name: "app/send.weekly.digest",
//         data: {
//           user_id: user.id,
//           email: user.email,
//         },
//       };
//     });

//     // 2️⃣ Now, we'll send all events in a single batch:
//     await step.sendEvent("send-digest-events", events);

//     // This function can now quickly finish and the rest of the logic will
//     // be handled in the function below ⬇️
//   }
// );

// // This is a regular Inngest function that will send the actual email for
// // every event that is received (see the above function's inngest.send())

// // Since we are "fanning out" with events, these functions can all run in parallel
// export const sendWeeklyDigest = inngest.createFunction(
//   { id: "send-weekly-digest-email" },
//   { event: "app/send.weekly.digest" },
//   async ({ event }) => {
//     // 3️⃣ We can now grab the email and user id from the event payload
//     const { email, user_id } = event.data;

//     // 4️⃣ Finally, we send the email itself:
//     await email.send("weekly_digest", email, user_id);

//     // 🎇 That's it! - We've used two functions to reliably perform a scheduled
//     // task for a large list of users!
//   }
// );
const functions = [
  prepareReminders
];
module.exports = { inngest, functions}