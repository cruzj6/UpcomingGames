import controller from './gamedatacontroller';
import express from 'express';

var router = express.Router();

router.get('/searchGames', controller.searchGames);
router.get('/articles', controller.getArticles);
router.get('/gameMedia', controller.gameMedia);
router.get('/topTracked', controller.getTopTrackedGames);
router.get('/advancedSearch', controller.getAdvancedSearch);

module.exports = router;
