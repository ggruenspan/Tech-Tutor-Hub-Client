const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User model (Mongoose schema)
const User = require('../../models/userSchema.js');

function signUp(req, res) {
    console.log('signUp', req.body);
};

function signIn(req, res) {
    console.log('signIn', req.body);
};

module.exports = {
    signUp,
    signIn
}