const { User } = require('../models/Users');
const jwt = require('jsonwebtoken');

let auth = (req, res, next) => {
    let token = req.cookies.x_auth;

    jwt.verify(token, 'secretToken', (err, decoded) => {
        if (err) return res.status(401).json({ isAuth: false, error: true });

        User.findById(decoded._id, (err, user) => {
            if (err) return res.status(401).json({ isAuth: false, error: true });
            if (!user) return res.status(401).json({ isAuth: false, error: true });

            req.token = token;
            req.user = user;
            next();
        });
    });
};

module.exports = { auth };