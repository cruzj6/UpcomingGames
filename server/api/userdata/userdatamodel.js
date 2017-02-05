/**
 * Created by Joey on 4/4/16.
 */
'use strict'
import mongojs from 'mongojs';
import _ from 'underscore-node';

export class UserDataModel {
    constructor(userid) {
        this.db = mongojs(process.env.DATABASE_URL2, ['userdata']);
        this.userid = userid;
    }

    /**
     * Get all of a user's tracked games by user id
     * 
     * @static
     * @param {any} handleUserIds callback function (err, ids)
     */
    getUsersTrackedGameIds(handleUserIds) {
        this.db.userdata.findOne({ userid: this.userid }, (err, data) => {
            if (err) {
                handleUserIds(err, null);
            }
            else if(!data){
                handleUserIds(err, []);
            }
            else {
                console.log("GOT: " + JSON.stringify(data));
                var ids = data.gameids;
                handleUserIds(err, ids);
            }
        });
    }

    /**
     * Add a game to a user's tracked games
     * 
     * @static
     * @param {any} gameid game to add by GB id
     * @param {any} doneCallback called when game has been added or error occurs (err)
     */
    addGameIDToUser(gameid, doneCallback) {
        this.getUsersTrackedGameIds((err, ids) => {
            if (_.findWhere(ids, gameid)) {
                doneCallback("Game Already Tracked");
            }
            else if(!ids){
                
            }
            else {
                //Add if it isnt already tracked
                this.db.userdata.update({ userid: this.userid }, {
                    "$push": { "gameids": gameid }
                }, (err, game) => {
                    if (err) {
                        doneCallback(err);
                    }
                    else doneCallback(err);
                })
            }
        });

    }

    /**
     * Remove a tracked game from a user
     * 
     * @static
     * @param {any} gameId game to remove by gb id
     * @param {any} userId id of user to remove it from
     * @param {any} doneCallback called when deletion happend or error occurs
     */
    removeGameIDFromUser(gameid, doneCallback) {
        this.db.userdata.update({ userid: this.userid }, {
            "$pull": { "gameids": gameid }
        }, (err, game) => {
            if (err) {
                doneCallback(err);
            }
            else doneCallback();
        });
    }

    /**
     * Add a steam id to associate with a user
     * 
     * @param {any} steamid steamid to associate
     * @param {any} doneCallback called with error or when done
     * 
     * @memberOf UserDataModel
     */
    addSteamIdToUser(steamid, doneCallback) {
        this.db.userdata.update({ userid: this.userid }, {
            "$set": { "steamid": steamid }
        }, (err, game) => {
            doneCallback(err);
        });
    }

    /**
     * Get the user's steam id if it exists, else null is passed (err, id)
     * 
     * @param {any} handleSteamId handle the steam id (err, id)
     * 
     * @memberOf UserDataModel
     */
    getSteamId(handleSteamId) {
        this.userdata.findOne({ userid: this.userid }, (err, data) => {
            if (err || !data.steamid) {
                handleSteamId(err, null);
            }
            else {
                handleSteamId(err, data.steamid);
            }
        });
    }
}