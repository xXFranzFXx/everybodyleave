const Event = require('../models/EventModel');
const User = require('../models/UserModel');
const SignedUpEvent = require('../models/SignedUpEventModel')
const mongoose = require('mongoose');

exports.saveReminder = async (req, res) => {
     const { mongoId, phone, datetime, timezone } = req.body;
     const session = await mongoose.startSession();
     const start = new Date(datetime);
     const endTime = start.setHours(start.getHours() + 1, 0, 0, 0)
       try {
            session.startTransaction();
            const tz =  `timezones.` + timezone;
            const id = new mongoose.Types.ObjectId(`${mongoId}`);
            const event = await SignedUpEvent.findOneAndUpdate(
                    { 
                        date: datetime,
                        'count': { $lte: 50 },
                        'usersAttending': { $ne: id }
                    },
                    {   
                        $set: { 'endsAt': endTime } ,
                        $addToSet: { 'usersAttending':  id  },
                        $inc:  { 'count': 1 } 
                    },
                    { 
                        new: true, upsert: true 
                    }, 
                    { 
                        session 
                    }, (err, doc) => {
                        if (err) {
                            console.log("could not find event with matching criteria: ", datetime);
                            return res.status(401).json({ err })
                        }
                    });
             if (event.count === 50) {
                const eventId = new mongoose.Types.ObjectId(`${event._id}`);
                await SignedUpEvent.updateOne({id: eventId}, 
                    { $set: { 'status': 'closed'} }, 
                    { new: true },
                    { session }
                )
                console.log("Group is now closed")
             }
            // const eventId = new mongoose.Types.ObjectId(`${event._id}`);
             await User.updateOne({ phone: phone }, 
                    { $addToSet: { 'reminder': event } },
                    { new: true },  { session });
          
            await session.commitTransaction();
            const { date } = event;
            req.io.emit('created reminder', { reminder: date });
            console.log("Transaction successful: ", event);
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
    const session = await mongoose.startSession();

        try {
            session.startTransaction();
            const id = new mongoose.Types.ObjectId(`${mongoId}`)

            const event = await SignedUpEvent.findOneAndUpdate({ date: datetime }, 
                { 
                    $pull: { 'usersAttending': { mongoId } },
                    $inc: { 'count': -1 },
                    $set: { 'status': 'open' }
                }, 
                { new: true }, { session }); 
       
                await User.updateOne({ phone: phone }, {
                        $pull: { 'reminder': event._id } 
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

exports.getDateRange = async (req, res) => {
    try {
        const agg = [
                {
                    $group: {
                        '_id': null, 
                        'earliestDate': {
                            $min: $date
                        }, 
                        'latestDate': {
                            $max: $date
                        }
                    }
                }
            ];
        
        const cursor = await Event.aggregate(agg);
        const result = await cursor.toArray()[0];
        req.io.emit("dateRange", result);
        return res.status(200).json({result});
    } catch (error) {
        console.log("Error getting date range: ", error);
        res.status(401).json("Error: ", error.message);
        throw error;
    }
}

exports.getAllDates = async (req, res) => {
    try {
        const agg =  [
                {
                    $project: {
                    'date': 1
                    }
                }
                ]
        
        const cursor = await Event.aggregate(agg);
        // const result = await cursor.toArray();
        console.log("cursor: ", cursor)
        req.io.emit("all dates", cursor);
        return res.status(200).json({cursor});
    } catch (error) {
        console.log("Error getting dates: ", error);
        res.status(401).json({error: error.message});
        throw error;
    }
}

exports.getLatestTime = async (req, res) => {
  try {  
    const agg = [
        {
            $sort: {
            'date': -1
            }
        }, {
            $limit: 1
        }, {
            $project: {
            'latest_date': '$date', 
            '_id': 0
            }
        }
    ];
     const cursor = await Event.aggregate(agg);
        // const result = await cursor.toArray();
        console.log("cursor: ", cursor)
        req.io.emit("latest time", cursor);
        return res.status(200).json({cursor});
    } catch (error) {
        console.log("Error getting dates: ", error);
        res.status(401).json({error: error.message});
        throw error;
    }

}