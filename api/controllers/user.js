const User = require('../models/UserModel');
const { jwtDecode } = require('jwt-decode');

//since we are using auth0 for authentication, use the token from auth0 to get user name
//after user signs in, check db for user, if user is there display any events he has a reminder set for, if no user, save user to mongodb
exports.postSignIn = (req, res) => {
    const { token, phone } = req.body;
    const decoded = jwtDecode(token);
    const { name } = token;
    const newUser = new User({ name, phone });

    User.findOne({ name }).exec((err, user) => {
        if (user) {
            return res.status(200).json({
                user
            })
            } else {
                newUser.save((err, success) => {
                    if (err) {
                        console.log('Cannot create user', err);
                        return res.status(401).json({
                            error: 'Error signing in'
                        });
                    }
                    return res.json({
                        message: 'Sign in success.'
                    });
                });
        } 
            return res.json({
                message: 'Something went wrong. Try again.'
            });
        })
    }

exports.scheduledReminders = async (req, res) => {
    const { mongoId, phone, datetime, message, group } = req.body;
    const agg = [
  {
    $match: {
      '_id': {
        $eq: new ObjectId(mongoId)
      }
    }
  }, {
    $unwind: '$reminder'
  }, {
    $lookup: {
      'from': 'events', 
      'localField': 'reminder', 
      'foreignField': '_id', 
      'as': 'eventDetails'
    }
  }, {
    $unwind: '$eventDetails'
  }, {
    $project: {
      'eventDate': '$eventDetails.date'
    }
  }
];


const cursor = await User.aggregate(agg);
const result = await cursor.toArray();
}
