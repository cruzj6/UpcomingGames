/**
 * Created by Joey on 4/4/16.
 */
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var express = require('express');
var User = require('./useraccountsmodel');
import validator from 'validator';
export var router = express.Router();

export var authSetup = (passport) => {

    /**
     * Strategy to create a new user in the database (Signup)
     */
    passport.use('ucgames-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        //passReqToCallback: true
    }, (email, password, done) => {
        //Clean input
        validator.escape(email);
        validator.escape(password);

        //Only passwords greater than 8 characters
        if (password.length < 8) {
            return done(null, false, "PASSWORD TOO SHORT");
        }
        if (!validator.isEmail(email)) {
            return done(null, false, "NOT AN EMAIL ADDRESS");
        }

        email = validator.normalizeEmail(email);

        //Check if user already exists
        User.findUser(email, (exists, err) => {
            if (exists) {
                console.log("USER ALREADY EXISTS: " + email);

                return done(null, false, "ACCOUNT ALREADY EXISTS")
            } else {
                console.log("CREATING USER" + email);

                //User doesn't exist, create the user
                var user = new User(email, User.generateHash(password));
                user.addUser((err) => {
                    if (!err) {
                        //Success
                        return done(null, user);
                    }
                });
            }
        });
    }));

    /**
     * Strategy to check if user exists, check if pass is valid, and sign in
     */
    passport.use('ucgames-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {

        //Clean input
        validator.escape(email);
        validator.escape(password);
        
        if (!validator.isEmail(email)) {
            return done(null, false, "NOT AN EMAIL ADDRESS");
        }
        validator.normalizeEmail(email);

        //Check if user exists
        User.findUser(email, (exists, err) => {
            if (!exists) {
                //User does not exist, exit
                console.log("USER DOESNT EXIST: " + email);

                return done(null, false, "User does not exist")
            } else {
                console.log("SIGNING IN USER" + email)

                //User exists, check if password is valid
                var user = new User(email, password);
                user.checkValidPassword(password, (isValidPass, err) => {
                    if (!err) {
                        if (isValidPass) {
                            console.log("AUTHENTICATED");
                            return done(null, user);
                        } else {
                            return done(null, false, "INVALID PASSWORD");
                        }
                    }
                });
            }
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}