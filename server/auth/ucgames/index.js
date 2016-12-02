/**
 * Created by Joey on 4/4/16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');

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
    res.render('signup');
});

/**
 * Redirects the user to the app if sign up is successful
 * Redirects back to sign up if unsuccessful
 */
router.post('/signup', passport.authenticate('ucgames-signup', {
    successRedirect: '/',
    failureRedirect: '/auth/ucgames/signup'
}));

export default router;