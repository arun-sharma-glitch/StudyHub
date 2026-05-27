const express = require('express');
const auth = require('../middlewares/authMiddleware');
const noteController = require('../controllers/noteController');
//multer
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

//upload note route
router.post('/upload', auth, upload.single('file'), noteController.uploadNote);

//get my-notes
router.get('/my-notes', auth, noteController.getMyNotes);

//get all notes
router.get('/', auth, noteController.getNotes);

//get public notes 
router.get('/public', noteController.getPublicNotes);

//increase downloads
router.patch('/download/:id', auth, noteController.increaseDownload);

//profile state
router.get('/profile-state', auth, noteController.profileState);

//delete note route
router.delete('/delete/:id', auth, noteController.deleteNote);

//save note route
router.patch('/bookmark/:id', auth, noteController.bookmarkNote);

//get saved notes route
router.get('/saved', auth, noteController.getSavedNotes);



module.exports = router;