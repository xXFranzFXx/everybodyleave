const mongoose = require('mongoose');
const userModel = require('./UserModel');

const SmsRecipientSchema = mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  phone: {
    type: String
  }
 
});

SmsRecipientSchema.index({ parentId: 1, phone: 1});
SmsRecipientSchema.static('getRecipient', function (mongoId, filters = {}) {
  return this.findOne({
    ...filters,
    parentId: mongoId,
});
})
userModel.discriminator('SmsRecipient', SmsRecipientSchema);
module.exports = mongoose.model('SmsRecipient');
