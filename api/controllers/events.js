const Event = require('../models/EventModel');
const User = require('../models/UserModel');

exports.saveReminder = (req, res) => {
     const { token, phone, reminderDate, timezone } = req.body;
        const decoded = jwtDecode(token);
        const { mongoId } = decoded
        const tz =  `timezones.` + timezone
         
        Event.findOneAndUpdate({ date: new Date(reminderDate), tz: { $ne: mongoId } }, // Find the document and check if the value exists in the nested array
                { $addToSet: { tz: { mongoId } } }, // If not found, add the value to the nested array
                { new: true }, // Return the updated document
                function(err, doc) {
                     if (err) {
                        console.log('Cannot create scheduled reminder', err);
                        return res.status(401).json({error: 'Error saving reminder'});
                    } else {
                        res.status(200).json({ doc })
                    }
            })
        }

//  { $pull: { 'preferences.notifications': notificationValue } }, // Use $pull to remove the value
 //     { new: true } // Return the updated document

 exports.cancelReminder = (req, res) => {
     const { token, phone, reminderDate, timezone } = req.body;
        const decoded = jwtDecode(token);
        const { mongoId } = decoded
        const tz =  `timezones.` + timezone
         
        Event.findOneAndUpdate({ date: new Date(reminderDate)}, // Find the document and check if the value exists in the nested array
                { $pull: { tz: { mongoId } } }, // If not found, add the value to the nested array
                { new: true }, // Return the updated document
                function(err, doc) {
                     if (err) {
                        console.log('Cannot cancel reminder', err);
                        return res.status(401).json({error: 'Error cancelling reminder'});
                    } else {
                        res.status(200).json({ doc })
                    }
            })
        }