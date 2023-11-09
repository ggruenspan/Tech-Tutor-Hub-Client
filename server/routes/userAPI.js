// routes/userAPI.js

const express = require('express');
const userController = require('../controllers/userControllers.js');
const passport = require('passport')
const router = express.Router();

router.post('/sign-up', (req,res) => {
    // console.log('sign-up');
    userController.signUp(req, res);
});

router.post('/sign-in', (req, res) => {
    // console.log('sign-in');
    userController.signIn(req, res);
});

router.get('/sign-out', (req, res) => {
    // console.log('signOut');
    res.clearCookie('token');
    res.status(200).json({ message: 'Sign out successfully' });
});

router.get('/authenticate', (req, res, next) => {
    passport.authenticate('jwt', { message: 'Custom message' }, (err, user, info) => {
        if (err) { return res.status(500).json({ message: info.message }); }
        if (!user) { return res.status(401).json({ message: info.message }); }
        return res.status(200).json({ message: info.message});
    })(req, res, next);
});

module.exports = router;
