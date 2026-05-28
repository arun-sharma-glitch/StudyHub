const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

async function auth(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'Login required'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
}

module.exports = auth;