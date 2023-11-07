// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  author: mongoose.Schema.Types.ObjectId,
  postId: mongoose.Schema.Types.ObjectId,
  parentCommentId: mongoose.Schema.Types.ObjectId, // for replies
});

module.exports = mongoose.model('Comment', commentSchema);
