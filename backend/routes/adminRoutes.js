const express = require('express');
const auth = require('../middlewares/authMiddleware');
const adminAuth = require('../middlewares/adminAuth');
const adminController = require('../controllers/adminController');


const router = express.Router();

//get stats analyticals
router.get('/stats', auth, adminAuth, adminController.getStats);

//get users lists
router.get('/users', auth, adminAuth, adminController.getUsers);

//get all notes
router.get('/notes', auth, adminAuth, adminController.getNotes);

// //delete a user by :id
router.delete('/users/:id', auth, adminAuth, adminController.deleteUser);

// //delete a note by :id
router.delete('/notes/:id', auth, adminAuth, adminController.deleteNote);






module.exports = router;