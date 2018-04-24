const express = require('express');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const rn = require('random-int');

const keys = require('./../config/keys.js');
const { User } = require('./../models/user.js');


/***** Google Auth Strategy *****/

passport.use(new googleStrategy({
    clientID: keys.google.APP_ID,
    clientSecret: keys.google.APP_SECRET,
    callbackURL: '/auth/google/redirect'
}, (accessToken, refreshToken, profile, cb) => {
    User.count({username: profile.displayName}, (err, count) => {
        if (count >= 1) {
           profile.displayName = profile.displayName + '_' + rn(2147483647).toString();
        }
        User.findOrCreate({email: profile.emails[0].value},
        {
            username: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value
        }, function (err, user) {
            if (err) {
                console.log(err);
                cb(err, user);
            }
            user.tokens.push({token : user.generateAuthToken() });
            user.save((err) => {
                if (err) {
                    console.log(err);
                }
            });
            return cb(err, user);
        })
    })
}));

/***** 42 Auth Strategy *****/

passport.use(new FortyTwoStrategy({
    clientID: keys.fortyTwo.APP_ID,
    clientSecret: keys.fortyTwo.APP_SECRET,
    callbackURL: "/auth/42/redirect"
  }, (accessToken, refreshToken, profile, cb) => {

    User.count({username: profile.username}, (err, count) => {
        if (count >= 1) {
           profile.username = profile.username + '_' + rn(2147483647).toString();
        }
        User.findOrCreate({email: profile.emails[0].value},
        {
            username: profile.username,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            avatar: profile.photos[0].value
        }, function (err, user) {
            if (err) {
                console.log(err);
                cb(err, user);
            }
            user.tokens.push({token : user.generateAuthToken() });
            user.save((err) => {
                if (err) {
                    console.log(err);
                }
            });
            return cb(err, user);
        });
    })    
}));

    
/***** Local Auth Strategy *****/

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done (null, false, { message: 'Incorrect username' })   
        }
        user.validPassword(password).then((res) => {
            user.tokens.push({token : user.generateAuthToken() });
            user.save((err) => {
                if (err) {
                    console.log(err);
                }
                return done(null, user)
            });
        }).catch((err) => {
            return done (null, false, { message: 'Incorrect password' })             
        });
    });   
}))