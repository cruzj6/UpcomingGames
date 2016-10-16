/**
 * Created by Joey on 4/3/16.
 */
var express = require('express');
var controller = require('./gamedatacontroller');

var router = express.Router();

router.get('/searchGames', controller.searchGames);
router.get('/articles', controller.getArticles);
router.get('/gameMedia', controller.gameMedia);
router.get('/topTracked', controller.getTopTrackedGames);
router.get('/advancedSearch', controller.getComingSoon);

module.exports = router;