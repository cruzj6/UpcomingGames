/**
 * Created by Joey on 4/4/16.
 */
var passport = require('passport');
var SteamStrategy = require('passport-local').Strategy;
var session = require('express-session');
var express = require('express');
var User = require('../../api/useraccounts/useraccountsmodel');
export var router = express.Router();

passport.use('ucgames-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    //Check if user already exists
    User.findUser(email, function (exists, err) {
        if (exists) { return done(null, false, "Account already exists") }
        else{
            //User doesn't exist, create the user
            
        }
    });

})
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

