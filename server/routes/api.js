// routes/api.js

const express = require('express');
const userController = require('./controllers/userControllers.js');
const router = express.Router();


router.post('/signup', function(req,res) {
    console.log('signup');
    userController.signup(req, res);
});

router.post('/signIn', function(req,res) {
    console.log('signIn');
    // userController.signIn(req, res);
});

module.exports = router;
