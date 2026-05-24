const jwt = require('jsonwebtoken');
const noteModel = require('../models/noteModel');



//upload note
async function uploadNote(req, res) {

    try {
        const token = req.cookies.token;

        console.log(
            req.body
        );

        console.log(
            req.file
        );

        if (!token) {
            return res.status(401).json({ message: "Login required!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { title, subject, semester, course, description, tags } = req.body;

        const note = await noteModel.create({
            title,
            subject,
            semester,
            courseName: course,
            description,
            tags,
            fileUrl: req.file.path.replace('/\\/g', '/'),
            uploadedBy: decoded.id,
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
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Login required!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const notes =
            await noteModel
                .find({
                    uploadedBy: decoded.id
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
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Login required!" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Login required!" });
        }

        const notes = await noteModel.find()
            .sort({
                createdAt: -1
            }).populate(
                'uploadedBy',
                'firstName lastName'
            );

        res.json({
            notes
        })

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
                returnDocument:'after'
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
        const token = req.cookies.token;

        if(!token) {
            return res.status(400).json({
                message:'Login required'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const notes = await noteModel.find(
            {uploadedBy: decoded.id}
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

    }catch(error) {
        console.log(error);
        res.status(500).json({
            message:'Server error'
        })
    }
}



//exporting
module.exports = {
    uploadNote,
    getMyNotes,
    getNotes,
    getPublicNotes,
    increaseDownload,
    profileState
}