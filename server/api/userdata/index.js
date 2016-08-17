/**
 * Created by Joey on 4/3/16.
 */
'use strict'

var express = require('express');
var router = express.Router();
var controller = require('./userdatacontroller');

router.get('/trackedGames', controller.getUserTrackedGames);
router.delete('/trackedGames', controller.removeTrackedGame);
router.post('/trackedGames', controller.addTrackedGame);
router.get('/friendsTrackedGames', controller.getFriendsTrackedGames);
router.get('/aUsersTrackedGames', controller.getAUsersTrackedGames);

module.exports = router;