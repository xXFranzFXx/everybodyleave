const Event = require('../models/EventModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose')
const { jwtDecode } = require('jwt-decode');

exports.saveReminder = async (req, res) => {
     const { mongoId, phone, datetime, timezone } = req.body;
     const session = await mongoose.startSession();

       try {
            session.startTransaction();
            const tz =  `timezones.` + timezone
            const id = new mongoose.Types.ObjectId(`${mongoId}`)

            const event = await Event.findOneAndUpdate({ date: datetime }, // Find the document and check if the value exists in the nested array
                    { $addToSet: { 'users':  id  } }, // If not found, add the value to the nested array
                    { new: true }, { session });
            const eventId = new mongoose.Types.ObjectId(`${event._id}`)
            const usr = await User.findOneAndUpdate({phone: phone}, 
                    {
                        $set: { reminder: eventId}
                    },{new: true},  { session });
          

                // await user;
                await session.commitTransaction();

                console.log("Transaction successful: ", event._id);
                return res.status(200).json({ event });

        } catch (error) {
            await session.abortTransaction();
            res.status(401).json({error: 'Error saving reminder'});
            throw error;
    } finally {
        session.endSession();
    }

    }

//  { $pull: { 'preferences.notifications': notificationValue } }, // Use $pull to remove the value
 //     { new: true } // Return the updated document

 exports.cancelReminder = async (req, res) => {
     const { mongoId, phone, reminderDate, timezone } = req.body;
        const tz =  `timezones.` + timezone;
        try {
            session.startTransaction();
        
            const event = await Event.findOneAndUpdate({ date: new Date(reminderDate)}, // Find the document and check if the value exists in the nested array
                { $pull: { tz: { mongoId } } }, // If not found, add the value to the nested array
                { new: true }, {session}); // Return the updated document
       
                await User.updateOne({ id: mongoId }, {
                 $pull: {
                     'reminder': event._id
                    } 
                }, {session} );

             await session.commitTransaction();
             
             console.log("Transaction successful");
             return res.status(200).json({ event });

        } catch (error) {
            await session.abortTransaction();
            console.log("Transaction failed: ", error);
            res.status(401).json({error: 'Error cancelling reminder'});
            throw error;

    } finally {
        session.endSession();
    }
    }