const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { JWT_SECRET_KEY, SENDGRID_API, EMAIL } = require('../../config/keys');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key : SENDGRID_API
    }
}));

router.post('/signup', (req, res, next) => {
    const {name, email, password, pic} = req.body;
    
    User.findOne({email: email})
    .then(savedUser => {
        if(savedUser) {
            return res.status(422).json({
                error: "User already exist with that email"
            });
        }
        
        bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name,
                pic: pic
            });
    
            user.save()
            .then(user => {
                transporter.sendMail({
                    to: user.email,
                    from: "akas17ec006@rmkcet.ac.in",
                    subject: "Account created successfully",
                    html: "<h1>Welcome to Instagram</h1>"
                })
                res.status(201).json({
                    message: "Account created successfully"
                });
            })
            .catch(error => {
                console.log(error);
            });

        })
        .catch(error => {
            console.log(error);
        });
    })
    .catch(error => {
        console.log(error);
    });
});

router.post('/signin', (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(422).json({
            error: "All fields are required"
        });
    }

    User.findOne({email: email})
    .then(savedUser => {
        if(!savedUser) {
            return res.status(422).json({
                error: "Invalid email or password"
            });
        }

        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch) {
                const token = jwt.sign( 
                        {
                            userId: savedUser._id
                        }, 
                        JWT_SECRET_KEY
                    );
                const { _id, name, email, followers, following, pic } = savedUser;
                res.status(200).json({
                    token: token,
                    user: { _id, name, email, followers, following, pic }
                });
            }
            else {
                return res.status(422).json({
                    error: "Invalid email or password"
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
    })
    .catch(error => {
        console.log(error);
    });
});

router.post('/reset-password', (req, res, next) => {
    crypto.randomBytes(32, (error, buffer) => {
        if(error) {
            console.log(error);
        }
        const token = buffer.toString("hex");

        User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                return res.status(422).json({
                    error: "User don't exist with that email"
                });
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 3600000;
            user.save()
            .then(result => {
                transporter.sendMail({
                    to: user.email,
                    from: "akas17ec006@rmkcet.ac.in",
                    subject: "Password Reset",
                    html:`
                        <h3>Password reset process</h3>
                        <p>click on the below link to reset password</p>
                        <p>${EMAIL}/reset/${token}<p>
                        
                    `
                })
                res.json({
                    message: "Check your mail for password reset process"
                });
            })
        })
    })
});

router.post('/new-password', (req, res, next) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({resetToken: sentToken, expireToken: {$gt: Date.now()}})
    .then(user => {
        if(!user) {
            return res.status(422).json({
                error: "The link has expired"
            });
        }

        bcrypt.hash(newPassword, 12)
        .then(hashedPassword => {
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.expireToken = undefined;

            user.save()
            .then(savedUser => {
                res.json({
                    message: "Password updated successfully"
                });
            })
            .catch(error => {
                console.log(error);
            })
        })
        .catch(error => {
            console.log(error);
        })
    })
    .catch(error => {
        console.log(error);
    });
});

module.exports = router;