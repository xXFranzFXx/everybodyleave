const Event = require('../models/EventModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose')

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
            const usr = await User.updateOne({phone: phone}, 
                    {
                        $set: { reminder: event.date}
                    },{new: true},  { session });
          
                await session.commitTransaction();
                req.io.emit('created reminder', { reminder: event.date })
                console.log("Transaction successful: ", event._id);
                const { date } = event
                return res.status(200).json({ date });

        } catch (error) {
            await session.abortTransaction();
            res.status(401).json({error: 'Error saving reminder'});
            throw error;
    } finally {
        session.endSession();
    }

}


 exports.cancelReminder = async (req, res) => {
     const { mongoId, phone, datetime, timezone } = req.body;
        const tz =  `timezones.` + timezone;
        try {
            session.startTransaction();
            const id = new mongoose.Types.ObjectId(`${mongoId}`)

            const event = await Event.findOneAndUpdate({ date: datetime }, 
                { $pull: { 'users': { mongoId } } }, 
                { new: true }, { session }); 
       
                await User.updateOne({ phone: phone }, {
                        $pull: { 'reminder': datetime } 
                    }, { session } );

                 await session.commitTransaction();
                req.io.emit('reminder cancelled', { date: event.date })
                console.log("Transaction successful");
                return res.status(200).json({ event });

        } catch (error) {
            await session.abortTransaction();
            console.log("Transaction failed: ", error);
            res.status(401).json({ error: 'Error cancelling reminder' });
            throw error;

    } finally {
        session.endSession();
    }
}