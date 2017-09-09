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
	router.post('/signup', (req, res, next) => {
		passport.authenticate('ucgames-signup', (err, user, info) => {
			if (err) {
				emitLoginError('Server Error in signup', err.message);

				return res.sendStatus(204); // No content to respond with, using socket.io instead
			}
			else if (!user) {
				emitLoginError(`Not able to signup`, info.message);

				return res.sendStatus(204);
			}
			else {
				req.logIn(user, err => {
	      	if (err) return next(err);

	      	return res.redirect('/');
    		});
			}
		})(req, res, next)
	});

	/**
	 * Redirects the user to the app if sign in is successful
	 * Redirects back to sign up if unsuccessful
	 */
	router.post('/signin', (req, res, next) => {
		try {
			passport.authenticate('ucgames-signin', (err, user, info) => {
				if (err) {
					emitLoginError('Server Error in login', err.message);

					return res.sendStatus(204); // No content to respond with, using socket.io instead
				}
				else if (!user) {
					emitLoginError(`Not able to login`, info.message);

					return res.sendStatus(204);
				}
				else {
					req.logIn(user, err => {
		      	if (err) return next(err);

		      	return res.redirect('/');
	    		});
				}
			})(req, res, next)
		}
		catch (e) {
			res.sendStatus(500);
			console.log('Signin error');
		}
	});

	return router;
}

export default getRouter;
