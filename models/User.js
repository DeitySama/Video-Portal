const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ],
        required:true,
        unique:true
      },
      name: { type: String, required: true },
      password: { type: String, required: true },
      role: { 
        type: String, 
        required: true, 
        default: 'admin' 
      },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }

})


module.exports = mongoose.model('User',UserSchema);