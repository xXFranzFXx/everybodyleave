const Event = require('../models/EventModel');
const User = require('../models/UserModel');
const session = await mongoose.startSession();

exports.saveReminder = async (req, res) => {
     const { token, phone, reminderDate, timezone } = req.body;
        const decoded = await jwtDecode(token);
        const { mongoId } = decoded;
        const tz =  `timezones.` + timezone;
       try {
            session.startTransaction();

            const event = await Event.findOneAndUpdate({ date: new Date(reminderDate), tz: { $ne: mongoId } }, // Find the document and check if the value exists in the nested array
                    { $addToSet: { tz: { mongoId } } }, // If not found, add the value to the nested array
                    { new: true }, { session });

                await User.updateOne({_id: mongoId}, 
                    {
                        $set: { reminder: event[0]._id }
                    }, { session });
                
                await session.commitTransaction();

                console.log("Transaction successful");
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
     const { token, phone, reminderDate, timezone } = req.body;
        const decoded = await jwtDecode(token);
        const { mongoId } = decoded;
        const tz =  `timezones.` + timezone;
        try {
            session.startTransaction();
        
            const event = await Event.findOneAndUpdate({ date: new Date(reminderDate)}, // Find the document and check if the value exists in the nested array
                { $pull: { tz: { mongoId } } }, // If not found, add the value to the nested array
                { new: true }, {session}); // Return the updated document
       
                await User.updateOne({ id: mongoId }, {
                 $pull: {
                     'reminder': event[0]._id
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