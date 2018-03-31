/**
 * Created by Joey on 4/4/16.
 */
'use strict'
import mongojs from 'mongojs';
import _ from 'underscore-node';

export class UserDataModel {
    constructor(userid) {
        this.db = mongojs(process.env.DATABASE_URL, ['userdata']);
        this.userid = userid;
    }

    /**
     * Get all of a user's tracked games by user id
     *
     * @param {any} handleUserIds callback function (err, ids)
     */
    getUsersTrackedGameIds(handleUserIds) {
        this.db.userdata.findOne({ userid: this.userid }, (err, data) => {
            if (err) {
                handleUserIds(err, null);
            }
            else {
                var ids = data.gameids;
                handleUserIds(err, ids);
            }
        });
    }

    /**
     * Add a game to a user's tracked games
     *
     * @param {any} gameid game to add by GB id
     * @param {any} done called when game has been added or error occurs (err, game)
     */
    addGameIDToUser(gameid, done) {
        this.getUsersTrackedGameIds((err, ids) => {
            if (_.findWhere(ids, gameid)) {
                done("Game Already Tracked");
            }
            else{
                //Add if it isnt already tracked
                this.db.userdata.update({ userid: this.userid }, {
                    "$push": { "gameids": gameid }
                }, (err, game) => {
                    if (err) {
                        done(err, game);
                    }
                    else done(err, game);
                });
            }
        });

    }

    /**
     * Remove a tracked game from a user
     *
     * @param {any} gameId game to remove by gb id
     * @param {any} done called when deletion happend or error occurs
     */
    removeGameIDFromUser(gameid, done) {
        this.db.userdata.update({ userid: this.userid }, {
            "$pull": { "gameids": gameid }
        }, (err, game) => {
            console.log('PULLED GAME: ', game)
            if (err) {
                done(err, game);
            }
            else done(err, game);
        });
    }

    /**
     * Add a steam id to associate with a user
     *
     * @param {any} steamid steamid to associate
     * @param {any} done called with error or when done
     *
     * @memberOf UserDataModel
     */
    addSteamIdToUser(steamid, done) {
        this.db.userdata.update({ userid: this.userid }, {
            "$set": { "steamid": steamid }
        }, (err, game) => {
            done(err, game);
        });
    }

    /**
     * Get the user's steam id if it exists, else null is passed (err, id)
     *
     * @param {any} callback handle the steam id (err, id)
     *
     * @memberOf UserDataModel
     */
    getSteamId(callback) {
        this.userdata.findOne({ userid: this.userid }, (err, data) => {
            if (err || !data.steamid) {
                callback(err, null);
            }
            else {
                callback(err, data.steamid);
            }
        });
    }

    /**
     * Add a new user element to the collection, if they don't exist
     *
     * @param {any} done called when done adding
     *
     * @memberOf UserDataModel
     */
    addUserForData(done) {
        this.db.userdata.findOne({ userid: this.userid }, (err, data) => {
            //Add if they don't exist
            if (!data) {
                this.db.userdata.save({ userid: this.userid, gameids: ["24024"] }, (err, user) => {
                    done(err, user);
                });
            }
            done(err, data);
        });
    }
}