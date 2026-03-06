const { inngest } = require("./reminders");
const dayjs = require('dayjs');

const countdownFunction = inngest.createFunction(
  { id: "countdown-job" },
  { event: "app/trigger.countdown" },
  async ({ event, step, publish }) => {
    await step.run("trigger-countdown", async () => {
      const currentTime = dayjs();
      const datetime = event.data.datetime;
      const eventId = event.data.eventId;
      const userId = event.data.user;
      await publish(`user: ${userId}`, { 
        topic: "countdown", 
        data: { 
          currentTime: currentTime,
          eventDate: datetime,
          eventId: eventId,
          userId: userId,
          message: "start the countdown timer" 
        } 
      });

      return { sentAt: currentTime };
    });
  }
);

module.exports = { countdownFunction };