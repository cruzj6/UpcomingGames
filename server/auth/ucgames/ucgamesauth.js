const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const express = require('express');
const validator = require('validator');
const User = require('./useraccountsmodel');

export const authSetup = (passport) => {

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
        if (password.length < 8) return done(null, false, { message: 'Password too short, must be 8 or more characters' });
        if (!validator.isEmail(email)) return done(null, false, { message: 'Not a valid email address' });

        validator.normalizeEmail(email);

        //Check if user already exists
        User.findUser(email, (exists, err) => {
            if (exists) {
                console.log("USER ALREADY EXISTS: " + email);

                return done(null, false, { message: 'Account already exists for this email' })
            } else {
                console.log("CREATING USER" + email);

                //User doesn't exist, create the user
                const user = new User(email, User.generateHash(password));
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

        if (!validator.isEmail(email)) return done(null, false, { message: 'Not a valid email address' });

        validator.normalizeEmail(email);

        //Check if user exists
        User.findUser(email, (exists, err) => {
            if (!exists) {
                //User does not exist, exit
                console.log('USER DOESNT EXIST: ' + email);

                return done(null, false, { message: 'User does not exist' })
            } else {
                console.log('SIGNING IN USER' + email)

                //User exists, check if password is valid
                const user = new User(email, password);
                user.checkValidPassword(password, (isValidPass, err) => {
                    if (!err) {
                        if (isValidPass) {
                            console.log("AUTHENTICATED");
                            return done(null, user);
                        } else {

                            return done(null, false, { message: 'Invalid Password' });
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
