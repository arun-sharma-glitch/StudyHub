const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const noteModel = require('../models/noteModel');
const fs = require('fs');
const path = require('path');



//get user profile controller
async function getUserProfile(req, res) {
    try {

        const user = await userModel.findById(req.user.id).select('-password');
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
        const { firstName, lastName, bio, university } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(req.user.id, { firstName, lastName, bio, university }, { returnDocument: 'after' });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated', user: updatedUser });

    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}


//update password
async function updatePassword(req, res) {
    console.log('inside update password controller');
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'Password do not matched'
            });
        }

        const user = await userModel.findById(req.user.id);

        const isMatched = await bcrypt.compare(currentPassword, user.password);

        if (!isMatched) {
            return res.status(400).json({
                message: 'Current password incorrect'
            })
        }

        const hashedpassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedpassword;
        await user.save();

        res.json({
            message: 'Password updated successfully'
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Server error'
        })
    }
}

//delete account completely
async function deleteAccount(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        const { password } = req.body;
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Password is incorrect'
            })
        }

        const notes = await noteModel.find({
            uploadedBy: req.user.id
        });


        for (const note of notes) {
            const filePath = path.join(__dirname, '../../', note.fileUrl);
            if(fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await noteModel.deleteMany({ uploadedBy: req.user.id });

        await userModel.findByIdAndDelete(req.user.id);

        res.clearCookie('token');

        res.json({
            message: 'Account Deleted!'
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server error'
        })
    }
}



module.exports = {
    getUserProfile,
    updateUserProfile,
    updatePassword,
    deleteAccount
};