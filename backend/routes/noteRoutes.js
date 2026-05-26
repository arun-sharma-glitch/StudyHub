const express = require('express');
const noteController = require('../controllers/noteController');
//multer
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

//upload note route
router.post('/upload', upload.single('file'), noteController.uploadNote);

//get my-notes
router.get('/my-notes', noteController.getMyNotes);

//get all notes
router.get('/', noteController.getNotes);

//get public notes 
router.get('/public', noteController.getPublicNotes);

//increase downloads
router.patch('/download/:id', noteController.increaseDownload);

//profile state
router.get('/profile-state', noteController.profileState);

//delete note route
router.delete('/delete/:id', noteController.deleteNote);

//save note route
router.patch('/bookmark/:id', noteController.bookmarkNote);

//get saved notes route
router.get('/saved', noteController.getSavedNotes);



module.exports = router;