const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
        required: true
    },
    credentialsAccount: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const userModel = mongoose.model("user", schema);
module.exports = userModel;