const mongoose = require('mongoose');


// Define the User schema
const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true
    },
    semester:{
        type:String,
        required:true
    },
    courseName: {
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    tags:{
        type:String,
        default:""
    },
    fileUrl:{
        type:String,
        required:true
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    downloads:{
        type:Number,
        default:0
    }
}, 
{
    timestamps:true
}
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;