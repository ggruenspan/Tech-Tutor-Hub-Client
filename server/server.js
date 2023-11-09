// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport')
const session = require('express-session')
const app = express();

// MongoDB connection setup
require('./bin/mongo-connection.js')

// Express session setup
app.use(session({
    secret: 'tech-tutor-hub',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

// Passport initialization and session setup
app.use(passport.initialize())
app.use(passport.session())
require('./config/passportConfig.js');

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/userAPI',  require('./routes/userAPI'));

// Start the server
const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});