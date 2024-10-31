const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        ref: "categories"
    },
    deadline: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }, 
    
}, {timestamps: true})

const taskModel = mongoose.model("tasks", schema);
module.exports = taskModel;