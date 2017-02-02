/**
 * Created by Joey on 4/4/16.
 */
import express from 'express';
var router = express.Router();
import session from 'express-session';
import passport from 'passport';

//Steam Auth
require('./steam/steamauth').setUp();
router.use('/steam', require('./steam').default);
router.use('/ucgames', require('./ucgames').default);

//Logout of session
router.get('/logout', (req, res) => {
    //When the user logs out destroy the session and log them out
    req.logout();
    req.session.destroy(function() {});

    //Redirect them home
    res.redirect('/');
});

module.exports = router;