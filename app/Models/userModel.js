const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({

    userId : {
        type : String,
        default : ''
    },

    email :{
        type : String,
        default : ''
    },
    subject : {
        type : String,
        default : ''
    },
    content : {
        type : String,
        default : ''
    }
})

module.exports = mongoose.model('User', User);