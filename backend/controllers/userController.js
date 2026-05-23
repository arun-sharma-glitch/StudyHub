const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');


//get user profile controller
async function getUserProfile(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }

}



//update user profile
async function updateUserProfile(req, res) {
    try {
        const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        const decoded = jwt.verify( token, process.env.JWT_SECRET );
        const { firstName, lastName, bio, university } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate( decoded.id, { firstName, lastName, bio, university }, { returnDocument: 'after' });

        if (!updatedUser) {
            return res.status(404).json({ message:'User not found' });
        }

        res.json({message: 'Profile updated', user: updatedUser });

    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}



module.exports = {
    getUserProfile,
    updateUserProfile
};