// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // L'email doit être unique
    },
    password: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        default: 0,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
