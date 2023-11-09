// controllers/userControllers.js

const bcrypt = require('bcrypt');

// User model (Mongoose schema)
const User = require('../models/userSchema.js');

const { jwtSign } = require('../config/jwtConfig.js');


function signUp(req, res) {
    // console.log('signUp', req.body);
    try {
        const { fullName, email, password } = req.body;

        User.findOne({ "accountSetting.personalInfo.email": email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ message: 'There is already a user with that email: ' + email });
            }

            // Hashes the password
            bcrypt.hash(password, 10)
            .then((hash) => {
                let newUser = new User({
                    userName: (fullName.split(" ")[0].charAt(0).toUpperCase() + fullName.split(" ")[0].slice(1)) + "." + fullName.split(" ")[0].charAt(0).toUpperCase(),
                    password: hash,
                    accountSetting: {
                        personalInfo: {
                            firstName: fullName.split(" ")[0],
                            lastName: fullName.split(" ")[1],
                            email: email,
                        },
                    },
                });

                // Create a new user
                newUser.save()
                .then(() => { 
                    res.status(201).json({ message: 'User signed up successfully' });
                })
                .catch((err) => {
                    // console.error(err);
                    return res.status(500).json({ message: 'An error occurred while signing up. Please try again' });
                });
            })
            .catch((hashErr) => {
                // console.error(hashErr);
                return res.status(500).json({ message: 'An error occurred while signing up. Please try again' });
            })
        })
        .catch((err) => {
            // console.error(err);
            return res.status(500).json({ message: 'An error occurred while signing up. Please try again' });
        })
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'Internal server error. Please try again' });
    }
};

function signIn(req, res) {
    // console.log('signIn', req.body);
    try {
        const { email, password } = req.body;

        User.findOne({ "accountSetting.personalInfo.email": email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'Unable to find user with email: ' + email });
            }

            // Check if password is correct
            bcrypt.compare(password, user.password)
            .then((result) => {
                if (result === true) {
                    const payload = {
                        id: user.id,
                        userName: user.userName,
                        password: user.password,
                        email: user.accountSetting.personalInfo.email,
                    }

                    user.accountSetting.loginHistory.push({dateTime: new Date(), userAgent: req.get('User-Agent')});
                    User.updateOne({ $set: { "accountSetting.loginHistory": user.accountSetting.loginHistory}})
                    .then(() => {
                        jwtSign(payload)
                        .then((token) => {
                            // res.setHeader('Authorization', `bearer ${token}`);
                            res.status(200).json({ message: 'User signed in successfully', token: token});
                        })
                        .catch((err) => {
                            // console.error(err);
                            return res.status(500).json('An error occurred while signing in. Please try again');
                        })
                    })
                    .catch((err) => {
                        // console.error(err);
                        return res.status(500).json({ message: 'An error occurred while signing in. Please try again' });
                    })
                } else {
                    // console.error(err);
                    return res.status(400).json({ message: 'Invalid username or password' });
                }
            })
            .catch((err) => {
                // console.error(err);
                return res.status(500).json({ message: 'An error occurred while signing in. Please try again' });
            })
        })
        .catch((err) => {
            // console.error(err);
            return res.status(500).json({ message: 'An error occurred while signing in. Please try again' });
        })
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'Internal server error. Please try again' });
    }
};

module.exports = {
    signUp,
    signIn,
}