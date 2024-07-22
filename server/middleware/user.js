// Middleware for handling auth
const jwt = require('jsonwebtoken');
const {Jwt_Secret} = require('../config');
const { User } = require('../db');
async function userMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            console.log('No token provided');
            return res.status(403).json({ msg: "Not authenticated" });
        }

        const words = token.split(' ');
        const jwtToken = words[1];
        const decodedJwt = jwt.verify(jwtToken, Jwt_Secret);
        console.log('Decoded JWT:', decodedJwt);

        if (decodedJwt.username) {
            const user = await User.findOne({ username: decodedJwt.username });
            if (!user) {
                console.log('User not found');
                return res.status(403).json({ msg: "User not found" });
            }
            req.user = user;
            console.log('User set in req:', req.user); // Log the user set in req
            next();
        } else {
            console.log('Username not found in token');
            res.status(403).json({ msg: "Not authenticated" });
        }
    } catch (error) {
        console.log('Error in middleware:', error);
        res.status(403).json({ msg: "Invalid token" });
    }
}

module.exports = userMiddleware;