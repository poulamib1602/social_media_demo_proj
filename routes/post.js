const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/user");
const { v4: uuidv4 } = require('uuid');
const response = require('../response');

router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return response.success(res, savedPost);
    } catch (error) {
        return response.error(res, error, 500);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            return response.success(res, "the post has been updated");
        } else {
            return response.success(res, "you can update only your post");
        }
    } catch (error) {
        return response.error(res, error, 500);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            return response.success(res, "the post has been deleted");
        } else {
            return response.success(res, "you can delete only your post");
        }
    } catch (error) {
        return response.error(res, error, 500);
    }
});

router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            return response.success(res, "The post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            return response.success(res, "The post has been disliked");
        }
    } catch (error) {
        return response.error(res, error, 500);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return response.success(res, post);
    } catch (error) {
        return response.error(res, error, 500);
    }
});

router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
         return response.success(res, userPosts.concat(...friendPosts));
    } catch (error) {
       return  response.error(res, error, 500);
    }
});

module.exports = router;