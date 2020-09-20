const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Post = require('../models/post');
const User = require('../models/user');

router.get('/user/:id', requireLogin, (req, res, next) => {
    User.findOne({ _id: req.params.id })
    .select("-password")
    .then(user => {
        Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((error, posts) => {
            if(error) {
                return res.status(422).json({
                    error: error
                })
            }
            res.json({user, posts})
        })
    })
    .catch(error => {
        return res.status(404).json({
            error: "User not found"
        })
    })
})

router.put('/follow', requireLogin, (req, res, next) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {followers: req.user._id}
    },
    {
        new: true
    }, (error, result) => {
        if(error) {
            return res.status(422).json({
                error: error
            })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.followId}
        },
        {
            new: true
        })
        .select("-password")
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            return res.status(422).json({
                error: error
            })
        })
    }
    )
})

router.put('/unfollow', requireLogin, (req, res, next) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {followers: req.user._id}
    },
    {
        new: true
    }, (error, result) => {
        if(error) {
            return res.status(422).json({
                error: error
            })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.unfollowId}
        },
        {
            new: true
        })
        .select("-password")
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            return res.status(422).json({
                error: error
            })
        })
    }
    )
});

router.put('/updatepic', requireLogin, (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {pic: req.body.pic}
    },
    {
        new: true
    },
    (error, result) => {
        if(error) {
            return res.status(422).json("Cannot update pic");    
        }
        res.json({
            message: "Updated successfully",
            result: result
        })
    }
    );
});

router.post('/search-users', (req, res, next) => {
    let userPattern = new RegExp("^" + req.body.query)
    User.find({name: {$regex: userPattern, $options:'i'}})
    .select("name pic _id")
    .then(user => {
        res.json({
            user: user
        });
    })
    .catch(error => {
        console.log(error);
    })
});

module.exports = router;