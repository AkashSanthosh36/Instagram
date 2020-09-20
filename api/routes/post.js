const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Post = require('../models/post');
const User = require('../models/user');

router.get('/allpost', requireLogin, (req, res, next) => {
    Post.find()
    .populate('postedBy', '_id name pic')
    .populate('comments.postedBy', '_id name')
    .sort('-createdAt')
    .then(posts => {
        res.status(200).json({
            posts: posts
        });
    })
    .catch(error => {
        console.log(error);
    });
});

router.get('/followedusersposts', requireLogin, (req, res, next) => {
    Post.find({postedBy: {$in: req.user.following}})
    .populate('postedBy', '_id name pic')
    .populate('comments.postedBy', '_id name')
    .sort('-createdAt')
    .then(posts => {
        res.status(200).json({
            posts: posts
        });
    })
    .catch(error => {
        console.log(error);
    });
});

router.post('/createpost', requireLogin, (req, res, next) => {
    const { title, body, pic } = req.body;
    if(!title || !body || !pic) {
        return res.status(422).json({
            error: "All fields are required"
        });
    }

    req.user.password = undefined;
    const post = new Post({
        title: title,
        body: body,
        photo: pic,
        postedBy: req.user
    });

    post.save()
    .then(result => {
        res.status(201).json({
            post: result,
        });
    })
    .catch(error => {
        console.log(error);
    });
});

router.get('/mypost', requireLogin, (req, res, next) => {
    User.findOne({_id: req.user._id})
    .select("-password")
    .then(user => {
        Post.find({ postedBy: req.user._id })
        .populate('postedBy', '_id name')
        .exec((error, myPosts) => {
            if(error) {
                return res.status(422).json({
                    error: error
                })
            }
            res.json({user, myPosts})
        })
    })
    .catch(error => {
        console.log(error)
    });
});

router.put('/like', requireLogin, (req, res, next) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id}
    }, 
    {
        new: true
    })
    .populate('postedBy', '_id name pic')
    .populate('comments.postedBy', '_id name')
    .exec((error, result) => {
        if(error) {
            return res.status(422).json({error: error})
        }
        else {
            res.json(result)
        }
    });
});

router.put('/unlike', requireLogin, (req, res, next) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    }, 
    {
        new: true
    })
    .populate('postedBy', '_id name pic')
    .populate('comments.postedBy', '_id name')
    .exec((error, result) => {
        if(error) {
            return res.status(422).json({error: error})
        }
        else {
            res.json(result)
        }
    });
});

router.put('/comment', requireLogin, (req, res, next) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment}
    }, 
    {
        new: true
    })
    .populate('postedBy', '_id name pic')
    .populate("comments.postedBy", "_id name")
    .exec((error, result) => {
        if(error) {
            return res.status(422).json({error: error})
        }
        else {
            res.json(result)
        }
    });
});

router.delete('/deletepost/:postId', requireLogin, (req, res, next) => {
    console.log(req.params.postId)
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((error, post) => {
        console.log(error, post)
        if(error || !post) {
            return res.status(422).json({
                error: error
            })
        }
        if(post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result => {
                res.json({
                    result: result
                })
            })
            .catch(error => {
                console.log(error)
            })
        }
    })
});


module.exports = router;