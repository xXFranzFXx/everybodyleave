const { Inngest, NonRetriableError } = require('inngest');
const inngest = new Inngest({ id: 'weekly_reminders', eventKey: process.env.INNGEST_EVENT_KEY });
const User = require('../models/UserModel');
const Event = require('../models/EventModel');
const SignedUpEvent = require('../models/SignedUpEventModel');
const EventBucket = require('../models/EventBucketModel');
const SmsLog = require('../models/SmsLogModel');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { processWebhook } = require('../helpers/webhook');
const {
  textBeeBulkSms,
  webhookResponse,
  textBeeInitialSms,
  textBeeSendSms,
  textBeeFinalSms,
} = require('../helpers/textBee');
const { sendSms } = require('../helpers/httpsms');
dayjs.extend(utc);
dayjs.extend(timezone);

//helper functions if not using dayjs

//get a time in the future
const getFutureTime = (minutesAhead) => {
  const now = new Date();
  now.setHours(now.getHours() + 1, 0, 0, 0);
  // now.setMinutes(now.getMinutes() + minutesAhead);
  console.log('future time is: ', now);
  return now;
};

const oneHourAgo = () => {
  const now = new Date();
  now.setHours(now.getHours() - 1, 0, 0, 0);
  console.log('time an hour ago is: ', now);
  return now;
};

// const isEmpty = (arr) => {
//   return Array.isArray(arr) && arr.length === 0;
// };

//*Only for testing
//calculates timeslots for certain days in future
const getFutureDate = (daysAhead) => {
  const today = new Date();
  const newDate = new Date(today.setDate(today.getDate() + daysAhead));
  console.log('newDate: ', newDate);
  const firstGroup = newDate.setHours(18, 0, 0, 0);
  console.log('firstGroup: ', firstGroup);
  const secondGroup = newDate.setHours(20, 0, 0.0);
  return { firstGroup, secondGroup };
};

// webhook function for processing sms replies.
const textBeeWhFunction = inngest.createFunction(
  { id: 'textBee-sms-received' },
  { event: 'textBee/sms.received' },
  async ({ event, step }) => {
    await step.run('process-wh-data', async () => {
      // const payload = await JSON.parse(rawBody);
      const payload = await processWebhook(event.data);
      const { sender, message, receivedAt } = await payload;
      console.log('Webhook payload:', payload);
      console.log('sender is: ', sender);
      console.log('response is: ', message);
      console.log('received at: ', receivedAt);
      await webhookResponse(sender, message, receivedAt);
    });

    return { status: 'success' };
  }
);
/**
 * Timezones:
 * EST/New_York, 17:00/21:00UTC same day 19:00/23:00UTC same day
 * CST/Chicago,  17:00/22:00UTC same day 19:00/00:00UTC next day
 * MST/Denver, 17:00/23:00UTC same day 19:00/01:00UTC next day
 * PST/Los_Angeles/17:00/00:00UTC next day 19:00/02:00UTC next day,
 * AKST/Anchorage, 17:00/01:00UTC next day 19:00/03:00UTC next day
 * HST/Honolulu 17:00/03:00UTC next day 19:00/05:00UTC next day
 */


/** Not Using
 * database task to create timeslots.
 */
const prepareReminders = inngest.createFunction(
  { id: 'prepare-weekly-reminders' },
  [{ cron: 'TZ=America/Los_Angeles 0 0 * * 6' }],
  async ({ step, event }) => {
    const weeklyReminders = await step.run('create-reminders', async () => {
      const mon5 = getFutureDate(3).firstGroup;
      const mon7 = getFutureDate(3).secondGroup;
      const wed5 = getFutureDate(5).firstGroup;
      const wed7 = getFutureDate(5).secondGroup;
      const fri5 = getFutureDate(7).firstGroup;
      const fri7 = getFutureDate(7).secondGroup;
      const data = [
        { date: mon5, usersAttending: [] },
        { date: mon7, usersAttending: [] },
        { date: wed5, usersAttending: [] },
        { date: wed7, usersAttending: [] },
        { date: fri5, usersAttending: [] },
        { date: fri7, usersAttending: [] },
      ];
      await Event.insertMany(data)
        .then((result) => {
          console.log('result ', result);
        })
        .catch((err) => {
          console.error('error ', err);
        });
    });
  }
);

/** Not Using
 * Get phone numbers of users for each event and send them to textbee to send a bulk reminder sms
 */
const sendBulkSms = inngest.createFunction(
  { id: 'textbee-bulk-sms' },
  [{ cron: 'TZ=America/Los_Angeles 45 9,15,16,18 * * 1,3,5' }],
  async ({ step, event }) => {
    const newTime = getFutureTime(15);
    const userList = await step.run('get-users', async () => {
      const datetime = new Date();
      // datetime.setMinutes(datetime.getMinutes() + 15)
      console.log('inngest datetime: ', datetime);
      try {
        const agg = [
          {
            $match: {
              date: newTime,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'usersAttending',
              foreignField: '_id',
              as: 'userDetails',
            },
          },
          {
            $project: {
              'userDetails.phone': 1,
            },
          },
        ];
        const cursor = await SignedUpEvent.aggregate(agg);
        // console.log("cursor: ", cursor);
        const eventId = await cursor[0]._id;

        const result = await cursor[0].userDetails;
        const phoneList = await result.map((user) => user.phone);
        const message =
          'This is your final scheduled reminder from EverybodyLeave. Respond with 1 if you will be participating, or 2 if you cannot participate. Please respond before your leave starts.  If no response is received, it will be defaulted to non-participation.  Thank you!';
        return { phoneList, message, eventId };
      } catch (err) {
        if (err.name === 'TypeError') {
          throw new NonRetriableError('No users signed up for this event');
        }
        throw err;
      }
    });

    if (userList) {
      const { phoneList, message, eventId } = userList;
      await step.run('send-textbee-bulk-sms', async () => {
        const eventDate = new Date(newTime);
        console.log('sending phonelist to textBee');
        await textBeeBulkSms(message, phoneList, eventId, eventDate);
      });
    }
  }
);

/** Not Using ***
 * TextBee Bulk Sms function.  
   triggered daily by cron
   checks mongoDb for users attending any events and then sends the sms followup one hour after the event
 */
const sendBulkSmsFollowup = inngest.createFunction(
  { id: 'textbee-bulk-sms-followup' },
  [{ cron: 'TZ=America/Los_Angeles 0 11,17,18,20 * * 1,3,5' }],
  async ({ step, event }) => {
    const newTime = oneHourAgo();
    const userList = await step.run('get-users', async () => {
      const datetime = new Date();
      // datetime.setMinutes(datetime.getMinutes() + 15)
      console.log('inngest datetime: ', datetime);
      try {
        const agg = [
          {
            $match: {
              date: newTime,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'usersAttending',
              foreignField: '_id',
              as: 'userDetails',
            },
          },
          {
            $project: {
              'userDetails.phone': 1,
            },
          },
        ];
        const cursor = await SignedUpEvent.aggregate(agg);
        // console.log("cursor: ", cursor);
        const eventId = await cursor[0]._id;

        const result = await cursor[0].userDetails;
        const phoneList = await result.map((user) => user.phone);
        const message =
          'Hello!  This is just a follow up to see how your leave went.  Please respond within 15 min with 1 if you successfully completed it, and 2 if you did not.  Thank you!';
        return { phoneList, message, eventId };
      } catch (err) {
        if (err.name === 'TypeError') {
          throw new NonRetriableError('No users signed up for this event');
        }
        throw err;
      }
    });

    if (userList) {
      const { phoneList, message, eventId } = userList;
      await step.run('send-textbee-bulk-sms-followup', async () => {
        console.log('sending phonelist to textBee for followup');
        await textBeeBulkSms(message, phoneList, eventId);
      });
    }
  }
);

/**. TEXTBEE SMS REMINDER WORKFLOW
 * user creates a leave, then the initial verification sms is sent.
   the nudgreminders get calculated and the function sleeps until the specified nudgereminder times.
   Nudgreminder sms is sent at each time.
   Function sleeps until 15 min prior to leave time.  
   Final sms is sent.
   Function waits for 20 min to receive webhook response.
   If no response is received, update the sms log to reflect "no-show" response.
   If a response is received, process the webhook.
   If the response is valid sleep until the leave ends.
   Send a followup sms.
   Workflow will cancel if user cancels the leave.
 */
const scheduleReminder = inngest.createFunction(
  {
    id: 'create-leave',
    cancelOn: [
      {
        event: 'reminders/delete.leave',
        if: 'async.data.eventId == event.data.eventId && async.data.userId == event.data.userId',
      },
    ],
  },
  { event: 'reminders/create.leave' },
  async ({ event, step }) => {
    const {
      userId,
      phone,
      dateScheduled,
      timezone,
      profileName,
      intention,
      logins,
      eventId,
      
      nudgeTimeUtc,
      nudgeMessage,
      nudgeReminderTs,
    } = event.data;
    const finalTime = dayjs(nudgeTimeUtc).subtract(15, 'minute');
    const followUpTime = dayjs(nudgeTimeUtc).add(1, 'hour');

    await step.run('send-textBee-initialSms', async () => {
      await textBeeInitialSms(eventId, profileName, phone, userId, dateScheduled, nudgeTimeUtc, intention, logins);
      });

    for (let i = 0; i < nudgeReminderTs.length; i++) {
      await step.sleepUntil('sleep-until-nudge-reminder-time', new Date(nudgeReminderTs[i]));
      await step.run('send-textBee-nudgeText', async () => {
        await textBeeSendSms(nudgeMessage, phone, userId, eventId, 'nudge', nudgeTimeUtc );
      });
    }

    await step.sleepUntil('sleep-until-final-reminder-time', new Date(finalTime));
    await step.run('send-textBee-final-Reminder', async () => {
      const current = dayjs();
      const leaveTime = dayjs(nudgeTimeUtc)
      const timeLeft = leaveTime.diff(current, 'minute');
      const message = `This is your final scheduled reminder from EbL. Your leave will begin in ${timeLeft} minutes.`; 
      await textBeeFinalSms(message, phone, userId, eventId, 'nudge', nudgeTimeUtc);
    });

      await step.sleepUntil('sleep-until-followup-time', new Date(followUpTime));
         await step.run('send-textBee-followup', async () => {
          const message =
        'Hello!  This is just a follow up to see how your leave went. Please verify within 15 minutes with 1 if your leave was successful or 2 if you were not able to complete it.  Thank you!';
         console.log('sending phonelist to textBee for followup');
         await textBeeSendSms(message, phone, userId, eventId, 'followup', nudgeTimeUtc);
      });
    const smsResponse = await step.waitForEvent('wait-for-sms-response', {
      event: 'textBee/sms.received',
      timeout: '25m',
      if: 'event.data.phone == async.data.sender',
    });
//if no response is received within 20 min update the smslog with 0
    if (!smsResponse ) {
          await updateSmsLog(eventId, phone, 'noResponse')
      console.log('Updated call log ');
      return { status: 'user failed to participate or respond to follow up.' }
       
    } else {
      return { status: 'Leave completed successfully.'}
  }
  }
);
const functions = [scheduleReminder, textBeeWhFunction];

module.exports = { inngest, functions };
