// models/userSchema.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    role: { type: [String], default: ['User'] },
    userName: String,
    password: String,
    email: String,
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        bio: String,
        phone: String,
        dof: String,
        address: {
            street1: String,
            street2: String,
            city: String,
            state: String,
            country: String,
            areaCode: String,
        }
    },
    loginHistory: [{
        _id: false,
        dateTime: Date,
        userAgent: String
    }],
    resetToken: String,
    resetTokenExpiration: Date,
});

module.exports = mongoose.model('Users', userSchema);