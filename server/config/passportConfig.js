// config/passportConfig.js

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// User model (Mongoose schema)
const User = require('../models/userSchema.js');

passport.use( new JwtStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'tech-tutor-hub', passReqToCallback: true}, (req, jwtPayload, done) => {
User.findOne({ _id: jwtPayload.id })
    .then((user) => {
        if(user) { return done(null, user, { message: 'Authentication successful' }); }
        else { return done(null, { message: 'Authentication failed' }); }
    })
    .catch((err) => { return done(err); });
}));

passport.serializeUser((user, done) => {
    done(null, user.userName);
});