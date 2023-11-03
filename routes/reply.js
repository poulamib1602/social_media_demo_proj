const express = require('express');
const Reply = require('../models/reply');

const repliesRouter = express.Router();

repliesRouter.get("/", async (req, res) => {
  try {
    const replies = await Reply.find();
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch replies' });
  }
});

repliesRouter.post("/", async (req, res) => {
  const { text, commentId } = req.body;
  if (!text || !commentId) {
    return res.status(400).json({ error: 'Text and Comment ID are required' });
  }

  try {
    const newReply = new Reply({ text, commentId });
    await newReply.save();
    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ error: 'Could not create a reply' });
  }
});

module.exports = repliesRouter;
