const express = require('express');
const Comment = require('../models/comment');
const commentsRouter = express.Router();
const response = require('../response'); 

commentsRouter.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ postId, parentCommentId: null });
    response.success(res,comments);
});

commentsRouter.post('/', async (req, res) => {
    const { text, author, postId } = req.body;
    const comment = new Comment({ text, author, postId });
    await comment.save();
    response.success(res,comment);
});

commentsRouter.post('/replies', async (req, res) => {
    const { text, author, parentCommentId } = req.body;
    const comment = new Comment({ text, author, parentCommentId });
    await comment.save();
    response.success(res,comment);
});

module.exports = commentsRouter;
