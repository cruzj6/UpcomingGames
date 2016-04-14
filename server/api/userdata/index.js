/**
 * Created by Joey on 4/3/16.
 */
'use strict'

var express = require('express');
var router = express.Router();
var controller = require('./userdatacontroller');

router.get('/userTrackedGames', controller.getUserTrackedGames);
router.post('/removeTrackedGame', controller.removeTrackedGame);
router.post('/addTrackedGame', controller.addTrackedGame);
router.get('/getFriendsTrackedGames', controller.getFriendsTrackedGames);
router.get('/aUsersTrackedGames', controller.getAUsersTrackedGames);

module.exports = router;