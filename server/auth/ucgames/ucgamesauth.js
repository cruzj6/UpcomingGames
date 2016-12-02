/**
 * Created by Joey on 4/4/16.
 */
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var express = require('express');
var User = require('./useraccountsmodel');
export var router = express.Router();

export var authSetup = function(passport) {
    passport.use('ucgames-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        //passReqToCallback: true
    }, function(email, password, done) {

        console.log("SIGN UP");
        //Check if user already exists
        User.findUser(email, function(exists, err) {
            if (exists) {
                console.log("USER ALREADY EXISTS: " + email);
                return done(null, false, "Account already exists")
            }
            else {
                console.log("CREATING USER" + email)
                //User doesn't exist, create the user
                var user = new User(email, User.generateHash(password));
                user.addUser(function(err)
                {
                    if(!err)
                    {
                        //Success
                        return done(null, user);
                    }
                });
            }
        });

    })
    );

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
}
