/**
 * Contains routes for the UC games account authentication
 */
var express = require('express');
var passport = require('passport');
require('connect-flash');

const ioLoginError = io => (err, reason) => io.emit('loginError', { err, reason });

const getRouter = io => {
	const router = express.Router();
	const emitLoginError = ioLoginError(io);

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
	    else {
	        res.send({
	            isIn: false
	        });
	    }
	});

	/**
	 * Renders the sign up page
	 */
	router.get('/signup', (req,res) => {
	    res.render('signup');
	});

	/**
	 * Redirects the user to the app if sign up is successful
	 * Redirects back to sign up if unsuccessful
	 */
	router.post('/signup', (req, res) => {
		passport.authenticate('ucgames-signup', (err, user, info) => {
			if (err) {
				emitLoginError('Server Error in signup', err.message);
				res.sendStatus(204); // No content to respond with, using socket.io instead
			}
			else if (!user) {
				emitLoginError(`Not able to signup`, info.message);
				res.sendStatus(204);
			}
			else {
				res.redirect('/');
			}
		})(req, res)
	});

	/**
	 * Redirects the user to the app if sign in is successful
	 * Redirects back to sign up if unsuccessful
	 */
	router.post('/signin', passport.authenticate('ucgames-signin', {
	    successRedirect: '/',
	    failureRedirect: '/loginpage' //Should route to welcomepage
	}));

	return router;
}

export default getRouter;
