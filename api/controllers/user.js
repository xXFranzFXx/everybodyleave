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

exports.scheduleReminder = (req, res) => {
    // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
    const { token, phone, date, message, group } = req.body;
    const decoded = jwtDecode(token);
    const { mongoId } = token;
    const reminder = { event: date, message: message };

    const newEvent = new Event({
        date: date,
        users: mongoId
    })
    const scheduledEvent = Event.findOne({ date: date })
    User.findOne({ name: name }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }    
        else {
            user.reminder = reminder
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }

            req.io.emit('reminder scheduled', updatedUser)
            res.json(updatedUser);
        });
    });
};

