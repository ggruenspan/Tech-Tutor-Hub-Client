// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_CONN_STR, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Express Session
app.use(
    session({
        secret: 'your-secret-key',
        saveUninitialized:true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        resave: false
    })
);

// API routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
