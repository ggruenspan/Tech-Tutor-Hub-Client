// routes/api.js

const express = require('express');
const userController = require('./controllers/userControllers.js');
const router = express.Router();


router.post('/sign-up', function(req,res) {
    // console.log('sign-up');
    userController.signUp(req, res);
});

router.post('/sign-in', function(req,res) {
    // console.log('sign-in');
    userController.signIn(req, res);
});

module.exports = router;
