const mongoose = require('mongoose');
const userSchema = require('./UserModel');
const eventModel = require('./EventModel');
/**
 * Since free tier of textbee limits bulk messaging to 50 recipients we need to create buckets for each event 
 * and cap them off at 50
 */
const EventBucketSchema = new mongoose.Schema({
    usersAttending: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], 
    bucketNumber: Number // To keep track of the bucket order
});

EventBucketSchema.path('usersAttending').index({ 
  unique: true, 
  partialFilterExpression: {
    '__type': 'EventBucket'
  }
})
eventModel.discriminator('EventBucket', EventBucketSchema);
module.exports = mongoose.model('EventBucket');