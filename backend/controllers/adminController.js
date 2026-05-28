const userModel = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const noteModel = require('../models/noteModel');

//get stats
async function getStats(
    req,
    res
) {

    try {

        const totalUsers =
            await userModel.countDocuments();

        const totalNotes =
            await noteModel.countDocuments();

        const recentUploads =
            await noteModel.countDocuments({
                createdAt: {
                    $gte:
                        new Date(
                            Date.now()
                            -
                            7 * 24 * 60 * 60 * 1000
                        )
                }
            });

        res.json({
            totalUsers,
            totalNotes,
            recentUploads
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


// get users 
async function getUsers(
    req,
    res
) {

    try {

        const users =
            await userModel.find()
                .select('-password');

        res.json(users);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                'Server error'
        });

    }

}

// get notes 
async function getNotes(
    req,
    res
) {

    try {

        const notes =
            await noteModel.find()
                .populate(
                    'uploadedBy',
                    'firstName lastName email'
                );

        res.json(notes);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                'Server error'
        });

    }

}

//delete note controller
async function deleteNote(
    req,
    res
) {

    try {

        const noteId =
            req.params.id;

        const note =
            await noteModel.findById(
                noteId
            );

        if (!note) {

            return res.status(404)
                .json({
                    message:
                        'Note not found'
                });

        }

        //delete file from uploads
        const filePath =
            path.join(
                __dirname,
                '../../',
                note.fileUrl
            );

        if (
            fs.existsSync(filePath)
        ) {

            fs.unlinkSync(filePath);

        }

        //delete note from database
        await noteModel.findByIdAndDelete(
            noteId
        );

        res.json({
            message:
                'Note deleted successfully'
        });

    }

    catch (error) {

        console.log(error);

        res.status(500)
            .json({
                message:
                    'Server error'
            });

    }

}


//delete user controller
async function deleteUser(
    req,
    res
) {

    try {

        const userId =
            req.params.id;

        //find user
        const user =
            await userModel.findById(
                userId
            );

        if (!user) {

            return res.status(404)
                .json({
                    message:
                        'User not found'
                });

        }

        //find all notes uploaded by user
        const notes =
            await noteModel.find({
                uploadedBy: userId
            });


        //delete uploaded files
        for (
            const note of notes
        ) {

            const filePath =
                path.join(
                    __dirname,
                    '../../',
                    note.fileUrl
                );

            if (
                fs.existsSync(filePath)
            ) {

                fs.unlinkSync(
                    filePath
                );

            }

        }


        //delete all notes
        await noteModel.deleteMany({
            uploadedBy: userId
        });


        //delete user
        await userModel.findByIdAndDelete(
            userId
        );


        res.json({
            message:
                'User deleted successfully'
        });

    }

    catch (error) {

        console.log(error);

        res.status(500)
            .json({
                message:
                    'Server error'
            });

    }

}


module.exports = {
    getStats,
    getNotes,
    getUsers,
    deleteNote,
    deleteUser
}