// routes/userAPI.js

const express = require('express');
const userController = require('../controllers/userControllers.js');
const router = express.Router();

router.post('/sign-up', (req,res) => {
    // console.log('sign-up');
    userController.signUp(req, res);
});

router.post('/sign-in', (req,res) => {
    // console.log('sign-in');
    userController.signIn(req, res);
});

module.exports = router;
