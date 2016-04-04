/**
 * Created by Joey on 4/3/16.
 */
var express = require('express');
var controller = require('./gamedatacontroller');

var router = express.Router();

router.get('/searchGames', controller.searchGames);
router.get('/getArticles', controller.getArticles);
router.get('/gameMedia', controller.gameMedia);
router.get('/getFriendsTrackedGames', controller.getFriendsTrackedGames);

module.exports = router;