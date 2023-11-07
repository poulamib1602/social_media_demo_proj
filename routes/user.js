const router = require('express').Router();
const user = require("../models/user");
const bcrypt = require("bcrypt");

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return response.error(res, error, 500);
            }
        }
        try {
            const users = await user.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            response.success(res,"Account has been updated");
        } catch (error) {
            response.error(res, error, 500);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
});
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await user.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (error) {
            return response.error(res, error, 500);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
});
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const User = await user.findById(req.params.id);
            const currentuser = await user.findById(req.body.userId);
            if (!User.followers.includes(req.body.userId)) {
                await User.updateOne({ $push: { followers: req.body.userId } });
                await currentuser.updateOne({ $push: { followings: req.params.id } });
                response.success(res, "user has been followed");
            } else {
                res.status(403).json("you already follow this user");
            }

        } catch (error) {
            res.status(403).json('you already follow this user');
        }
    } else {
        res.status(403).json("you can't follow yourself");
    }
});
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const User = await user.findById(req.params.id);
            const currentUser = await user.findById(req.body.userId);
            if (User.followers.includes(req.body.userId)) {
                await User.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                response.success(res, "user has been unfollowed");
            } else {
                response.success(res, "you dont follow this user");
            }
        } catch (error) {
            response.error(res, error, 500);
        }
    } else {
        res.status(403).json("you cant unfollow yourself");
    }
});
module.exports = router