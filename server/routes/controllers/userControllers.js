const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User model (Mongoose schema)
const User = require('../../models/userSchema.js');

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
                return res.status(400).json({ message: 'Unable to find user with email: ' + email });
            }

            // Check if password is correct
            bcrypt.compare(password, user.password)
            .then((result) => {
                if (result === true) {
                    user.accountSetting.loginHistory.push({dateTime: new Date(), userAgent: req.get('User-Agent')});
                    User.updateOne({ $set: { "accountSetting.loginHistory": user.accountSetting.loginHistory}})
                    .then(() => {
                        // Generate a JWT for the user
                        const token = jwt.sign({ username: user.username, userId: user._id }, "secretKey", {
                            expiresIn: '1h', // Token expires in 1 hour
                        });
                        // res.status(201).json({ message: 'User created', token, userId: newUser._id });
                        res.status(201).json({ message: 'User signed in successfully', token });
                    })
                    .catch((err) => {
                        // console.error(err);
                        return res.status(500).json({ message: 'An error occurred while signing in. Please try again' });
                    })
                } else {
                    // console.error(err);
                    return res.status(400).json({ message: 'Invalid username or password: ' + email });
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
    signIn
}