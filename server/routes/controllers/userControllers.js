const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User model (Mongoose schema)
const User = require('../../models/userSchema.js');

function signup(req, res) {
    console.log('signup', req.body);
};

module.exports = {
    signup,
}