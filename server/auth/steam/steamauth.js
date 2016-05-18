/**
 * Created by Joey on 4/4/16.
 */
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var session = require('express-session');
var express = require('express');
export var router = express.Router();

export function setUp()
{
    //Set up our strategies, starting with steam strategy
    passport.use(new SteamStrategy({
        //TODO: CHANGE TO REAL URL ON DEPLOY
        returnURL: 'https://upcominggames-staging.herokuapp.com/auth/steam/return',
        //returnURL: 'http://localhost:5000/auth/steam/return',
        realm: process.env.HOME_URL,
        //realm: 'http://localhost:5000',
        apiKey: process.env.STEAM_API_KEY
    }, function (identifier, profile, done) {
        process.nextTick(function () {

            //Set the profile identifier to the full URL identifier
            profile.identifier = identifier;
            return done(null, profile);
        });
    }));
}

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

