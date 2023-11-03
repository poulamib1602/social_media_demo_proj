const express = require('express');
const Comment = require('../models/comment');
const commentsRouter = express.Router();



commentsRouter.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch comments' });
  }
});

commentsRouter.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const newComment = new Comment({ text });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Could not create a comment' });
  }
});

module.exports = commentsRouter;
