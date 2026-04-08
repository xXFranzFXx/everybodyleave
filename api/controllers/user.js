const User = require('../models/UserModel');
const SmsLog = require('../models/SmsLogModel');
const { jwtDecode } = require('jwt-decode');
const mongoose = require('mongoose');
//since we are using auth0 for authentication, use the token from auth0 to get user name
//after user signs in, check db for user, if user is there display any events he has a reminder set for, if no user, save user to mongodb
exports.postSignIn = (req, res) => {
  const { token, phone } = req.body;
  // const decoded = jwtDecode(token);
  const { name } = token;
  const newUser = new User({ name, phone });

  User.findOne({ name }).exec((err, user) => {
    if (user) {
      return res.status(200).json({
        user,
      });
    } else {
      newUser.save((err, success) => {
        if (err) {
          console.log('Cannot create user', err);
          return res.status(401).json({
            error: 'Error signing in',
          });
        }
        return res.json({
          message: 'Sign in success.',
        });
      });
    }
    return res.json({
      message: 'Something went wrong. Try again.',
    });
  });
};

exports.scheduledReminders = async (req, res) => {
  const { mongoId, phone, datetime, message, group } = req.body;
  const agg = [
    {
      $match: {
        _id: {
          $eq: new ObjectId(mongoId),
        },
      },
    },
    {
      $unwind: '$reminder',
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
      $unwind: '$eventDetails',
    },
    {
      $project: {
        eventDate: '$eventDetails.date',
      },
    },
  ];

  const cursor = await User.aggregate(agg);
  const result = await cursor.toArray();
};

exports.getProgress = async (req, res) => {
  try {
    const { id } = await req.query;
    console.log("mongoId from Progress", id)
    const agg = [
      {
        $match: {
          recipient: new mongoose.Types.ObjectId(`${id}`),
          messageType: 'followup',
          status: 'complete',
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$eventDate',
            },
          },
          credit: {
            $cond: {
              if: {
                $eq: ['$response', 'noResponse'],
              },
              then: 0,
              else: '$response',
            },
          },
        },
      },
    ];

    const cursor = await SmsLog.aggregate(agg);
    console.log("progress fetched: ", cursor[0])
    // const result = await cursor.toArray();
    return res.status(200).json({ cursor });
  } catch (error) {
    res.status(401).json({ error: error.message });
    throw error;
  }
};
