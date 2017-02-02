/**
 * Created by Joey on 4/3/16.
 */
'use strict'

import express from 'express';
import UserDataController from './userdatacontroller';
var router = express.Router();

router.get('/trackedGames', UserDataController.getUserTrackedGames);
router.delete('/trackedGames', UserDataController.removeTrackedGame);
router.post('/trackedGames', UserDataController.addTrackedGame);
router.get('/friendsTrackedGames', UserDataController.getFriendsTrackedGames);
router.get('/aUsersTrackedGames', UserDataController.getAUsersTrackedGames);

module.exports = router;