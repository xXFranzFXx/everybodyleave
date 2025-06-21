const { Inngest } = require('inngest');
const inngest = new Inngest({ id: "445_reminders" });
const User = require('../models/UserModel');
const Event = require('../models/EventModel');

// This weekly digest function will run at 12:00pm on Friday in the Paris timezone
/*
Timezones: EST/New_York, CST/Chicago, MST/Denver, PST/Los_Angeles, AKST/Alaska, HST/Hawaii

*/
const getFutureDate = (daysAhead) => {
  const today = new Date();
  const newDate = new Date(today.setDate(today.getDate() + daysAhead));
  const firstGroup = newDate.setHours(17)
  const secondGroup = newDate.setHours(19)
  return { firstGroup, secondGroup }
}
const prepareRemindersPST = inngest.createFunction(
  { id: "prepare-weekly-reminders" },
  { cron: "TZ=America/Los_Angeles 0 0 * * 6"},
  async ({ step }) => {
    // create event documents in mongo db
    const weeklyReminders= await step.run(
      "create-reminders",
      async () => {
        const mon5 = getFutureDate(2).firstGroup;
        const mon7 = getFutureDate(2).secondGroup;
        const wed5 = getFutureDate(4).firstGroup;
         const wed7 = getFutureDate(4).secondGroup;
        const fri5 = getFutureDate(6).firstGroup;
        const fri7 = getFutureDate(6).secondGroup;

        const data = [
          {date: mon5, timezone: 'PDT', users:[]},  
          {date: mon7, timezone: 'PDT', users:[]},  
          {date: wed5, timezone: 'PDT', users:[]},  
          {date: wed7, timezone: 'PDT', users:[]},  
          {date: fri5, timezone: 'PDT', users:[]},
          {date: fri7, timezone: 'PDT', users:[]}  
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

const prepareRemindersEST = inngest.createFunction(
  { id: "prepare-weekly-reminders" },
  { cron: "TZ=America/New_York 0 0 * * 6"},
  async ({ step }) => {
    // create event documents in mongo db
    const weeklyReminders= await step.run(
      "create-reminders",
      async () => {
        const mon5 = getFutureDate(2).firstGroup;
        const mon7 = getFutureDate(2).secondGroup;
        const wed5 = getFutureDate(4).firstGroup;
         const wed7 = getFutureDate(4).secondGroup;
        const fri5 = getFutureDate(6).firstGroup;
        const fri7 = getFutureDate(6).secondGroup;

        const data = [
          {date: mon5, timezone: 'EDT', users:[]},  
          {date: mon7, timezone: 'EDT', users:[]},  
          {date: wed5, timezone: 'EDT', users:[]},  
          {date: wed7, timezone: 'EDT', users:[]},  
          {date: fri5, timezone: 'EDT', users:[]},
          {date: fri7, timezone: 'EDT', users:[]}  
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

const prepareRemindersCST = inngest.createFunction(
  { id: "prepare-weekly-reminders" },
  { cron: "TZ=America/Chicago 0 0 * * 6"},
  async ({ step }) => {
    // create event documents in mongo db
    const weeklyReminders= await step.run(
      "create-reminders",
      async () => {
        const mon5 = getFutureDate(2).firstGroup;
        const mon7 = getFutureDate(2).secondGroup;
        const wed5 = getFutureDate(4).firstGroup;
         const wed7 = getFutureDate(4).secondGroup;
        const fri5 = getFutureDate(6).firstGroup;
        const fri7 = getFutureDate(6).secondGroup;

        const data = [
          {date: mon5, timezone: 'CDT', users:[]},  
          {date: mon7, timezone: 'CDT', users:[]},  
          {date: wed5, timezone: 'CDT', users:[]},  
          {date: wed7, timezone: 'CDT', users:[]},  
          {date: fri5, timezone: 'CDT', users:[]},
          {date: fri7, timezone: 'CDT', users:[]}  
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
const prepareRemindersMST = inngest.createFunction(
  { id: "prepare-weekly-reminders" },
  { cron: "TZ=America/Denver 0 0 * * 6"},
  async ({ step }) => {
    // create event documents in mongo db
    const weeklyReminders= await step.run(
      "create-reminders",
      async () => {
        const mon5 = getFutureDate(2).firstGroup;
        const mon7 = getFutureDate(2).secondGroup;
        const wed5 = getFutureDate(4).firstGroup;
         const wed7 = getFutureDate(4).secondGroup;
        const fri5 = getFutureDate(6).firstGroup;
        const fri7 = getFutureDate(6).secondGroup;

        const data = [
          {date: mon5, timezone: 'MDT', users:[]},  
          {date: mon7, timezone: 'MDT', users:[]},  
          {date: wed5, timezone: 'MDT', users:[]},  
          {date: wed7, timezone: 'MDT', users:[]},  
          {date: fri5, timezone: 'MDT', users:[]},
          {date: fri7, timezone: 'MDT', users:[]}  
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

const prepareRemindersAKST = inngest.createFunction(
  { id: "prepare-weekly-reminders" },
  { cron: "TZ=America/Alaska 0 0 * * 6"},
  async ({ step }) => {
    // create event documents in mongo db
    const weeklyReminders= await step.run(
      "create-reminders",
      async () => {
        const mon5 = getFutureDate(2).firstGroup;
        const mon7 = getFutureDate(2).secondGroup;
        const wed5 = getFutureDate(4).firstGroup;
         const wed7 = getFutureDate(4).secondGroup;
        const fri5 = getFutureDate(6).firstGroup;
        const fri7 = getFutureDate(6).secondGroup;

        const data = [
          {date: mon5, timezone: 'AKDT', users:[]},  
          {date: mon7, timezone: 'AKDT', users:[]},  
          {date: wed5, timezone: 'AKDT', users:[]},  
          {date: wed7, timezone: 'AKDT', users:[]},  
          {date: fri5, timezone: 'AKDT', users:[]},
          {date: fri7, timezone: 'AKDT', users:[]}  
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

const prepareRemindersHST = inngest.createFunction(
  { id: "prepare-weekly-reminders" },
  { cron: "TZ=America/Hawaii 0 0 * * 6"},
  async ({ step }) => {
    // create event documents in mongo db
    const weeklyReminders= await step.run(
      "create-reminders",
      async () => {
        const mon5 = getFutureDate(2).firstGroup;
        const mon7 = getFutureDate(2).secondGroup;
        const wed5 = getFutureDate(4).firstGroup;
         const wed7 = getFutureDate(4).secondGroup;
        const fri5 = getFutureDate(6).firstGroup;
        const fri7 = getFutureDate(6).secondGroup;

        const data = [
          {date: mon5, timezone: 'HDT', users:[]},  
          {date: mon7, timezone: 'HDT', users:[]},  
          {date: wed5, timezone: 'HDT', users:[]},  
          {date: wed7, timezone: 'HDT', users:[]},  
          {date: fri5, timezone: 'HDT', users:[]},
          {date: fri7, timezone: 'HDT', users:[]}  
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
  prepareRemindersPST,
  prepareRemindersAKST,
  prepareRemindersCST,
  prepareRemindersEST,
  prepareRemindersHST,
  prepareRemindersMST
];
module.exports = { inngest, functions}