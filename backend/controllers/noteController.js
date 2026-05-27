const noteModel = require('../models/noteModel');
const userModel = require('../models/userModel');
const fs = require('fs');
const path = require('path');


//upload note
async function uploadNote(req, res) {

    try {

        const { title, subject, semester, course, description, tags } = req.body;

        const note = await noteModel.create({
            title,
            subject,
            semester,
            courseName: course,
            description,
            tags,
            fileUrl: req.file.path.replace('/\\/g', '/'),
            uploadedBy: req.user.id
        });

        res.status(201).json({
            message: "note uploaded successfully",
            note
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'server error'
        })
    }
}


//get my-notes
async function getMyNotes(req, res) {

    try {
        
        const notes =
            await noteModel
                .find({
                    uploadedBy: req.user.id
                })
                .sort({
                    createdAt: -1
                });


        res.json({
            notes
        })

    } catch (error) {
        console.log('error in getting my notes: ', error);

        res.status(500)
            .json({ message: 'Server error' });
    }
}


//get all Notes
async function getNotes(req, res) {
    try {

        const notes = await noteModel.find()
            .sort({
                createdAt: -1
            }).populate(
                'uploadedBy',
                'firstName lastName'
            );

        const user = await userModel.findById(
            req.user.id
        );
        const savedNotes = user.savedNotes;

        res.json({
            notes,
            savedNotes
        });

    } catch (error) {
        console.log('error in getting all notes: ', error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

//get public notes limit 4
async function getPublicNotes(req, res) {
    try {
        const notes = await noteModel.find()
            .sort({
                createdAt: -1
            })
            .limit(4)
            .populate(
                'uploadedBy',
                'firstName lastName'
            );
        //sending data in response
        res.json({
            notes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server Error'
        })
    }
}


//increase downloads
async function increaseDownload(req, res) {

    try {
        const noteId = req.params.id;

        const note = await noteModel.findByIdAndUpdate(
            noteId,
            {
                $inc: {
                    downloads: 1
                }
            },
            {
                returnDocument: 'after'
            }
        );

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            })
        }

        res.json({
            downloads: note.downloads
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Server error'
        })
    }
}

//profile state
async function profileState(req, res) {
    try {
        
        const notes = await noteModel.find(
            { uploadedBy: req.user.id }
        );

        const totalNotes = notes.length;
        const totalDownloads = notes.reduce((sum, note) =>
            sum + note.downloads,
            0
        );

        res.json({
            totalNotes,
            totalDownloads
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server error'
        })
    }
}

//delete notes
async function deleteNote(req, res) {
    try {

        const note = await noteModel.findById(
            req.params.id
        );

        if (!note) {
            return res.status(404).json({
                message: 'Note not found'
            })
        }

        if (note.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not allowed'
            })
        }



        const filePath = path.join(__dirname, '../../', note.fileUrl);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await note.deleteOne();
        res.json({
            message: 'Note deleted successfully'
        })


    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Server error'
        })
    }
}

//save note
async function bookmarkNote(req, res) {
    try {

        const noteId = req.params.id;

        const user =
            await userModel.findById(
                req.user.id
            );

        const alreadySaved =
            user.savedNotes.some(
                id =>
                    id.toString() === noteId
            );

        if (alreadySaved) {

            await userModel.findByIdAndUpdate(
                req.user.id,
                {
                    $pull: {
                        savedNotes:
                            noteId
                    }
                }
            );

        }
        else {
            await userModel.findByIdAndUpdate(

                req.user.id,

                {
                    $push: {
                        savedNotes:
                            noteId
                    }
                }

            );

        }

        res.json({

            saved:
                !alreadySaved,

            message:

                alreadySaved ? 'Note removed' : 'Note saved'
        });

    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'Server error'
        });

    }

}


//get saved notes
async function getSavedNotes(
    req,
    res
) {

    try {


        const user =
            await userModel
                .findById(

                    req.user.id

                )
                .populate({

                    path:
                        'savedNotes',

                    populate: {

                        path:
                            'uploadedBy',

                        select:
                            'firstName lastName'

                    }

                });

        res.json({

            savedNotes:

                user.savedNotes

        });

    }
    catch (error) {

        console.log(
            error
        );

        res.status(500)
            .json({

                message:
                    'Server error'

            });

    }

}

//exporting
module.exports = {
    uploadNote,
    getMyNotes,
    getNotes,
    getPublicNotes,
    increaseDownload,
    profileState,
    deleteNote,
    bookmarkNote,
    getSavedNotes
}