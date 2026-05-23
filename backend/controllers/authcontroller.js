const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//register user controller
async function registerUser(req, res) {

    const existingToken = req.cookies.token;

    if (existingToken) {
        try {
            const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);

            const user = await userModel.findById(decoded.id);

            if (user) {
                return res.status(400).json({
                    message: 'user already logged in'
                })
            }
            
        } catch (error) {
            //invalid token
            //continue signup
        }
    }

    try {
        if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const { firstName, lastName, email, password } = req.body;

        const isUserExist = await userModel.findOne({ email });

        if (isUserExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // --------------------------------------

        const hashedPassword = await bcrypt.hash(password, 10);


        // -------------------------------------------

        const newUser = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set the token as a cookie in the response
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 7 * 60 * 60 * 24 * 1000 });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json(
            { message: "server error" }
        );
        console.log("server error: ", error);
    }
}


//login user controller
async function loginUser(req, res) {

    // Check if the user is already logged in by verifying the token from cookies
    const existingToken = req.cookies.token;

    if (existingToken) {
        try {
            const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
            return res.json({ message: 'User already logged in', existingToken });
        } catch (error) {
            // If token is invalid or expired, we can ignore the error and proceed with login
        }
    }

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }


    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(
        password,
        user.password
    );

    if(!match) {
                return res.status(400).json({ message: 'Invalid email or password' });
    }


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' }); // Set cookie to expire in 7 days
    res.json({ message: 'Login successful', token });
}

module.exports = {
    registerUser,
    loginUser
}