const jwt =  require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../config/keys');
const mongoose =  require('mongoose');

const User = require('../models/user');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        User.findById({_id: decoded.userId})
       .then(userData => {
            req.user = userData;
            next();
        });
    }
    catch(error) {
        return res.status(401).json({
            error: 'Login required'
        });
    }
};