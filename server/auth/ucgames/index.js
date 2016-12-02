/**
 * Created by Joey on 4/4/16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');

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

export default router;