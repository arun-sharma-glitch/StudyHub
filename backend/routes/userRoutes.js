const express = require('express');
const auth = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

//get user profile route
router.get('/profile', auth, userController.getUserProfile);

//update user profile
router.put('/profile', auth, userController.updateUserProfile);

//update password
router.patch('/password', auth, userController.updatePassword);

//delete account permanently
router.delete('/account', auth, userController.deleteAccount);


module.exports = router;