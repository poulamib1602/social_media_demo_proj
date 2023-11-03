const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: String,
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
});

module.exports = mongoose.model('Reply', replySchema);
