const mongoose = require('mongoose');



const FileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
        max:1000
    },
    path:{
        type:String,
        required:true,
        max:1000
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    }
})

module.exports = mongoose.model('File',FileSchema);