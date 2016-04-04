'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Joey on 4/4/16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', passport.authenticate('steam'), function (req, res) {
    //This will not be called
    res.redirect('/');
});

router.get('/return', passport.authenticate('steam', { failureRedirect: '/login' }), function (req, res) {

    console.log("SUCCESSFUL AUTH STEAM");
    console.log(req.isAuthenticated());
    // Successful authentication, redirect home.
    res.redirect('/');
});

exports.default = router;

//# sourceMappingURL=index-compiled.js.map