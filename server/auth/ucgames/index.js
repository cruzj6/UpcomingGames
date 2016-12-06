/**
 * Created by Joey on 4/4/16.
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
router.get('/isLoggedIn', function(req, res)
{
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
router.get('/signup', function(req,res){
    res.redirect('/login/signup.html');
});

/**
 * Redirects the user to the app if sign up is successful
 * Redirects back to sign up if unsuccessful
 */
router.post('/signup', passport.authenticate('ucgames-signup', {
    successRedirect: '/',
    failureRedirect: '/auth/ucgames/signup',
    failureFlash: true
}));

/**
 * Redirects the user to the app if sign in is successful
 * Redirects back to sign up if unsuccessful
 */
router.post('signin', passport.authenticate('ucgames-signin', {
    successRedirect: '/',
    failureRedirect: '/', //Should route to welcomepage
    failureFlash: true
}));

export default router;