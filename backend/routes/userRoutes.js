const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

//get user profile route
router.get('/profile', userController.getUserProfile);

//update user profile
router.put('/profile', userController.updateUserProfile);




module.exports = router;