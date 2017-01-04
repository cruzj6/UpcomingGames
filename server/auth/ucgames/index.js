/**
 * Contains routes for the UC games account authentication
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
require('connect-flash');

/**
 * Returns true if the user is logged in
 * {
 *  isIn: <bool>
 * }
 */
router.get('/isLoggedIn', (req, res) => {
    if(req.isAuthenticated()) {
        res.send({
            isIn: true
        });
    }
    else{
        res.send({
            isIn: false
        });
    }
});

/**
 * Renders the sign up page
 */
router.get('/signup', (req,res) => {
    res.redirect('/login/signup.html');
});

/**
 * Redirects the user to the app if sign up is successful
 * Redirects back to sign up if unsuccessful
 */
router.post('/signup', passport.authenticate('ucgames-signup', {
    successRedirect: '/',
    failureRedirect: '/auth/ucgames/signup'
}));

/**
 * Redirects the user to the app if sign in is successful
 * Redirects back to sign up if unsuccessful
 */
router.post('/signin', passport.authenticate('ucgames-signin', {
    successRedirect: '/',
    failureRedirect: '/loginpage' //Should route to welcomepage
}));

export default router;