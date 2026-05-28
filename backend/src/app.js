const express = require('express');
const path = require('path');
const authRoutes = require('../routes/authRoutes.js');
const userRoutes = require('../routes/userRoutes.js');
const noteRoutes = require('../routes/noteRoutes.js');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userModel =require('../models/userModel');
const auth =require('../middlewares/authMiddleware');
///===============admin route=================///
const adminRoutes = require('../routes/adminRoutes.js');
const adminAuth = require('../middlewares/adminAuth');




const app = express();

//middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// app.use(express.static(path.join(__dirname, '../../frontend')));
app.use('/css',express.static(path.join(__dirname, '../../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../../frontend/js')));



//this is actually the route for the auth controller,
app.use('/api/auth', authRoutes);

//this is actually the route for the user controller,
app.use('/api/user', userRoutes);

//this is actually the route for the note controller,
app.use('/api/notes', noteRoutes);

///===============admin route=================///
app.use('/api/admin', adminRoutes);



//Home Route Index.html
app.get('/', async (req, res) => {

    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await userModel.findById(decoded.id);

            if (user) {
                return res.redirect('/dashboard');
            }
        } catch (error) {
            // If token is invalid or expired, we can ignore the error and proceed to serve the home page
        }
    }

    res.sendFile(path.join(__dirname, '../../frontend/pages/index.html'));

});

//Sign up route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/pages/signup.html'));
});

//Login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/pages/login.html'));
});

//Logout route
app.get('/logout', (req, res) => {
    res.clearCookie(
        'token',
        {
            httpOnly:true,
            sameSite:'strict'
        }
    );

    res.redirect('/');
    console.log('logout successfull');
});

//dashboard route
app.get('/dashboard', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/pages/dashboard.html'));
});

//profile route
app.get('/profile', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/pages/profile.html'));
});

//upload route
app.get('/upload', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/pages/upload.html'))
});


//admin page route
app.get('/admin', auth, adminAuth, (req,res)=>{
        res.sendFile(path.join(__dirname, '../../frontend/pages/admin_dashboard.html'));
    }
);




module.exports = app;