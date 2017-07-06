/**
 * Contains routes for the UC games account authentication
 */
var express = require('express');
var passport = require('passport');
require('connect-flash');

const getRouter = io => {
	const router = express.Router();

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
	router.post('/signup', passport.authenticate('ucgames-signup', (err, user, info) => {
		if (err) {
			io.emit('loginError', `Error in signup: ${err}`)
			console.log('hey!')
		}
		else if (!user) {
			io.emit('loginError', `Not able to signup: ${info || ''}`);
			console.log('hi!')
		}
		else {
			res.redirect('/');
		}
	}))
	// {
	//     successRedirect: '/',
	//     failureRedirect: '/auth/ucgames/signup'
	// }));

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
