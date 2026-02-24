const mongoose = require('mongoose');
const userModel = require('./UserModel');

const SmsRecipientSchema = mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
 
});

SmsRecipientSchema.index({ parentId: 1 });
SmsRecipientSchema.static('getRecipient', function (mongoId, filters = {}) {
  const id = new mongoose.Types.ObjectId(`${mongoId}`)
  return this.findOne({
    ...filters,
    parentId: id,
});
})
userModel.discriminator('SmsRecipient', SmsRecipientSchema);
module.exports = mongoose.model('SmsRecipient');
