/**
 * Created by Joey on 4/4/16.
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('passport');

//Steam Auth
require('./steam/steamauth').setUp();
router.use('/steam', require('./steam').default);

//Logout of session
router.get('/logout', function (req, res) {
    //When the user logs out destroy the session and log them out
    req.logout();
    req.session.destroy(function () {});

    //Redirect them home
    res.redirect('/');
});

module.exports = router;