const Event = require('../models/EventModel');
const User = require('../models/UserModel');
const SignedUpEvent = require('../models/SignedUpEventModel');
const EventBucket = require('../models/EventBucketModel');
const mongoose = require('mongoose');
const dayjs =  require('dayjs');
//This method puts a limit of 50 users per bucket. Use this if using free tier for textBee
exports.saveToBucket = async (req, res) => {
  const MAX_USERS_PER_BUCKET = process.env.MAX_USERS_PER_BUCKET; // Or whatever limit you choose
  const { mongoId, phone, datetime, timezone } = req.body;
  try {
    // let newEvent;
    // const event = await EventBucket.findOne({ date: datetime });

    // const eventID = new mongoose.Types.ObjectId(`${event?._id}`);
    const userId = new mongoose.Types.ObjectId(`${mongoId}`);
    const start = new Date(datetime);
    const endTime = start.setHours(start.getHours() + 1, 0, 0, 0);

    let latestBucket = await EventBucket.findOne({ date: datetime }).sort({ bucketNumber: -1 }).lean(); // Use lean() for performance if you're not modifying
    console.log('latestBucket: ', latestBucket);
    if (!latestBucket || latestBucket.usersAttending.length >= MAX_USERS_PER_BUCKET) {
      // Create a new bucket
      const newBucketNumber = latestBucket ? latestBucket.bucketNumber + 1 : 1;
      let newEvent = await Event.create({
        date: datetime,
        endsAt: endTime,
        type: 'EventBucket',
        status: 'open',
        usersAttending: [userId],
      });

      await User.updateOne({ phone: phone }, { $addToSet: { reminder: newEvent } }, { new: true, upsert: true });
      await req.io.emit('created reminder', { reminder: datetime });
      return res.status(200).json({ newEvent });
    } else {
      // Add to existing bucket
      try {
        const eventBucket = await EventBucket.updateOne(
          {
            _id: latestBucket._id,
            //   'usersAttending': { $ne: userId }
          },
          { $addToSet: { usersAttending: userId } }
        );
        await User.updateOne({ phone: phone }, { $addToSet: { reminder: eventBucket } }, { new: true, upsert: true });
        await req.io.emit('created reminder', { reminder: datetime });
        return res.status(200).json({ eventBucket });
      } catch (error) {
        req.io.emit('reminder failed', { message: 'User is already registered' });
        return res.status(401).json({ 'Error joining event for reminder': error });
      }
    }
  } catch (error) {
    req.io.emit('reminder failed', { message: 'Failed to schedule reminder' });
    res.status(401).json({ 'Error creating reminder': error });
    throw error;
  }
};

exports.removeReminder = async (req, res) => {
  const { mongoId, phone, datetime, timezone } = req.body;
  try {
    const id = new mongoose.Types.ObjectId(`${mongoId}`);
    const event = await EventBucket.findOneAndUpdate(
      { date: datetime },
      { $pull: { usersAttending: id } },
      { new: true }
    );

    await User.updateOne(
      { phone: phone },
      {
        $pull: { reminder: event._id },
      }
    );

    await req.io.emit('reminder cancelled', { date: event.date });
    console.log('Transaction successful');
    return res.status(200).json({ event });
  } catch (error) {
    // await session.abortTransaction();
    console.log('Transaction failed: ', error);
    res.status(401).json({ error: 'Error cancelling reminder' });
    throw error;
  }
};
//old method
exports.saveReminder = async (req, res) => {
  const MAX_USERS_PER_BUCKET = process.env.MAX_USERS_PER_BUCKET; // Or whatever limit you choose
  const { mongoId, phone, datetime, timezone } = req.body;
  const session = await mongoose.startSession();
  const start = new Date(datetime);
  const endTime = start.setHours(start.getHours() + 1, 0, 0, 0);
  try {
    session.startTransaction();
    const tz = `timezones.` + timezone;
    const id = new mongoose.Types.ObjectId(`${mongoId}`);
    let totalUsers = await SignedUpEvent.findOne({ date: datetime }).sort({ usersAttending: -1 }, { session });
    if (Array.isArray(totalUsers) && totalUsers.length === MAX_USERS_PER_BUCKET - 1 && !totalUsers.includes(id)) {
      const event = await SignedUpEvent.updateOne(
        { datetime },
        {
          $inc: { count: 1 },
          $addToSet: { usersAttending: id },
          $set: { status: 'closed' },
        },
        { new: true, upsert: true },
        { session }
      );
      await User.updateOne(
        { phone: phone }, 
        { $addToSet: { reminder: event },
          $inc: { credit: -1 } 
        
        }, { new: true, upsert: true }, { session });

      await session.commitTransaction();
      const { date } = event;
      req.io.emit('created reminder', { reminder: date });
      console.log('Transaction successful: ', event);
      return res.status(200).json({ date });
    } else {
      const event = await SignedUpEvent.findOneAndUpdate(
        {
          date: datetime,
          count: { $lte: MAX_USERS_PER_BUCKET - 1 },
          usersAttending: { $ne: id },
        },
        {
          $inc: { count: 1 },
          $set: {
            endsAt: endTime,
          },
          $addToSet: { usersAttending: id },
        },
        { new: true, upsert: true },
        { session }
      );
      // const eventId = new mongoose.Types.ObjectId(`${event._id}`);
      await User.updateOne({ phone: phone }, { $addToSet: { reminder: event } }, { new: true, upsert:true }, { session });

      await session.commitTransaction();
      const { date } = event;
      req.io.emit('created reminder', { reminder: date });
      console.log('Transaction successful: ', event);
      return res.status(200).json({ date });
    }
  } catch (error) {
    await session.abortTransaction();
    res.status(401).json({ error: 'Error saving reminder' });
    throw error;
  } finally {
    session.endSession();
  }
};

//for use with pro version of textbee
exports.cancelReminder = async (req, res) => {
  const { mongoId, phone, datetime, timezone } = req.body;
  const tz = `timezones.` + timezone;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const id = new mongoose.Types.ObjectId(`${mongoId}`);
    const event = await SignedUpEvent.findOneAndUpdate(
      { date: datetime },
      {
        $pull: { usersAttending: id },

        $set: { status: 'open' },
        $inc: { count: -1 },
      },
      { new: true },
      { session }
    );

    await User.updateOne(
      { phone: phone },
      {
        $pull: { reminder: event._id },
      },
      { session }
    );

    await session.commitTransaction();
    req.io.emit('reminder cancelled', { date: event.date });
    console.log('Transaction successful');
    return res.status(200).json({ event });
  } catch (error) {
    await session.abortTransaction();
    console.log('Transaction failed: ', error);
    res.status(401).json({ error: 'Error cancelling reminder' });
    throw error;
  } finally {
    session.endSession();
  }
};

exports.getDateRange = async (req, res) => {
  try {
    const agg = [
      {
        $group: {
          _id: null,
          earliestDate: {
            $min: $date,
          },
          latestDate: {
            $max: $date,
          },
        },
      },
    ];

    const cursor = await Event.aggregate(agg);
    const result = await cursor.toArray()[0];
    req.io.emit('dateRange', result);
    return res.status(200).json({ result });
  } catch (error) {
    console.log('Error getting date range: ', error);
    res.status(401).json('Error: ', error.message);
    throw error;
  }
};
/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */
exports.getAllOpenDates = async (req, res) => {
  const today = dayjs().format();
  console.log("dayjs today: ", today)
  try {
    const filter = {
      $and: [
        {
          date: {
            $gte: today,
          },
        },
        {
          status: 'open',
        },
      ],
    };
    const cursor = await Event.find(filter);
    // const result = await cursor.toArray();
    console.log('open dates: ', cursor);
    req.io.emit('all open dates', cursor);
    return res.status(200).json({ cursor });
  } catch (error) {
    console.log('Error getting open dates: ', error);
    res.status(401).json({ error: error.message });
    throw error;
  }
};

exports.getAllDates = async (req, res) => {
  try {
    const agg = [
      {
        $project: {
          date: 1,
        },
      },
    ];

    const cursor = await Event.aggregate(agg);
    // const result = await cursor.toArray();
    // console.log('cursor: ', cursor);
    req.io.emit('all dates', cursor);
    return res.status(200).json({ cursor });
  } catch (error) {
    console.log('Error getting dates: ', error);
    res.status(401).json({ error: error.message });
    throw error;
  }
};

exports.getLatestTime = async (req, res) => {
  try {
    const agg = [
      {
        $sort: {
          date: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          latest_date: '$date',
          _id: 0,
        },
      },
    ];
    const cursor = await Event.aggregate(agg);
    // const result = await cursor.toArray();
    // console.log('cursor: ', cursor);
    req.io.emit('latest time', cursor);
    return res.status(200).json({ cursor });
  } catch (error) {
    console.log('Error getting dates: ', error);
    res.status(401).json({ error: error.message });
    throw error;
  }
};

exports.getReminders = async (req, res) => {
  const { id } = req.query;
  const mongoId = new mongoose.Types.ObjectId(`${id}`)
  // console.log("req: ", req)
  try {
    const agg = [
      {
        $match: {
          _id: mongoId,
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: 'reminder',
          foreignField: '_id',
          as: 'eventDetails',
        },
      },
      {
        $project: {
          _id: 0,
          eventDates: '$eventDetails.date',
        },
      },
    ];

    const cursor = await User.aggregate(agg);
    // console.log('cursor: ', cursor);
    const result = await cursor[0].eventDates
    req.io.emit('scheduleReminders',  { scheduledReminders: result } );
    return res.status(200).json({ result });
  } catch (error) {
    console.log('Error getting scheduled reminders: ', error);
    res.status(401).json({ error: error.message });
    throw error;
  }
};
