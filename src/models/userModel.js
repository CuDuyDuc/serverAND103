const mongoose = require('mongoose');

const UserScheme = new mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    photoUrl: {
        type: String
    },
    address: {
        type: String
    }

},{
    timestamps:true
})
const UserModel = mongoose.model('user', UserScheme);
module.exports = UserModel;