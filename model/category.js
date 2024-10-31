const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        ref: "tasks"
    }
}, {timestamps: true});

module.exports = mongoose.model("categories", schema);