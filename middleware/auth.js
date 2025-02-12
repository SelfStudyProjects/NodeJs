const { User } = require('../models/Users');
const jwt = require('jsonwebtoken');

let auth = (req, res, next) => {
    let token = req.cookies.x_auth;

    User.findByToken(token, function(err, user) {
        if(err) throw err;
        if(!user) return res.json({
            isAuth: false,
            error: true
        });
        
        req.token = token;
        req.user = user;
        next();
    })

    User.findById(decoded, function(err, user) {
        if(err) return res.status(403).send({ success: false, message: "Failed to authenticate token." });
        req.token = token;
        req.user = user;
        next();
    });
}

module.exports = { auth };