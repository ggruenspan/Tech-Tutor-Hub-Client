// models/userSchema.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    accountSetting: {
        role: { type: [String], default: ['User'] },
        personalInfo: {
            firstName: String,
            middleInitial: String,
            lastName: String,
            phone: String,
            dof: String,
            address: String,
            email: {
                type: String,
                unique: true
            },
        },
        loginHistory: [{
            _id: false,
            dateTime: Date,
            userAgent: String
        }],
    },
    resetToken: String,
    resetTokenExpiration: Date,
});

module.exports = mongoose.model('users', userSchema);