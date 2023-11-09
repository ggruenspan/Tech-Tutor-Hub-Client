// bin/mongo-connection.js

const mongoose = require('mongoose');

// MongoDB connection setup
mongoose.connect("mongodb+srv://ggruenspan:8Cro67a3dKaushWu@cluster0.zeimtb8.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});