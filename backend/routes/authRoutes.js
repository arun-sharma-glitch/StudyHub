const express = require('express');
const authController = require('../controllers/authcontroller');

const router = express.Router();


//this is post register to actually register the user, we will add more routes later
router.post('/register', authController.registerUser);

//this is post login to actually login the user, we will add more routes later
router.post('/login', authController.loginUser);




module.exports = router;