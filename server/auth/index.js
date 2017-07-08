/**
 * Created by Joey on 4/4/16.
 */
import express from 'express';
import session from 'express-session';
import passport from 'passport';

//Steam Auth
require('./steam/steamauth').setUp();

module.exports = io => {
	const router = express.Router();

	router.use('/steam', require('./steam').default);
	router.use('/ucgames', require('./ucgames').default(io));

	//Logout of session
	router.get('/logout', (req, res) => {
	    //When the user logs out destroy the session and log them out
	    req.logout();
	    req.session.destroy(function() {});

	    //Redirect them home
	    res.redirect('/');
	});

	return router;
}
