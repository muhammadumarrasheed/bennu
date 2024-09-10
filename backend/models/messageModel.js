// Model for user-to-user messaging

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Sender of the message
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Receiver of the message
  content: { type: String, required: true }, // Message content
  sent_at: { type: Date, default: Date.now },
  read: { type: Boolean, default: false } // Whether the message has been read
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
