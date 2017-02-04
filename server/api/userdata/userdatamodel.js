/**
 * Created by Joey on 4/4/16.
 */
'use strict'
import mongojs from 'mongojs';
import _ from 'underscore-node';

module.exports = class UserDataModel {
    constructor() {
        this.db = mongojs(process.env.DATABASE_URL2, ['usertrackedgames']);
    }

    /**
     * Get all of a user's tracked games by user id
     * 
     * @static
     * @param {any} userid id of the user
     * @param {any} handleUserIds callback function (err, ids)
     */
    static getUsersTrackedGameIds(userid, handleUserIds) {
        db.usertrackedgames.find({ userid: userid }, (err, games) => {
            if (err) {
                handleUserIds(err, null);
            }
            else handleUserIds(err, _.filter(games, (item) => item.gameid != "undefined"));
        });
    }

    /**
     * Add a game to a user's tracked games
     * 
     * @static
     * @param {any} gameid game to add by GB id
     * @param {any} userid id of the user
     * @param {any} doneCallback called when game has been added or error occurs (err)
     */
    static addGameIDToUser(gameid, userid, doneCallback) {
        this.getUsersTrackedGameIds(userid, (err, ids) => {
            if(_.findWhere(ids, {gameid: gameid})){
                doneCallback("Game Already Tracked");
            }
            
            //Add if it isnt already tracked
            db.usertrackedgames.save({
                userid: userid,
                gameid: gameid
            }, (err, game) => {
                if (err) {
                    doneCallback(err);
                }
                else doneCallback();
            })
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
     static removeGameIDFromUser(gameId, userId, doneCallback) {
            db.usertrackedgames.remove({
                userid: userid,
                gameid: gameid
            }, (err, game) => {
                if (err) {
                    doneCallback(err);
                }
                else doneCallback();
            });
     }
}

//Add a gameId to the database for a user that they wish to track
/*module.exports = class UserDataModel {
    static addGameIDToUser(gameId, userId, doneCallback) {
        pg.defaults.ssl = true;

        pg.connect(process.env.DATABASE_URL, (err, client, done) => {
            if (err) throw err;
            console.log('Connected to postgres! Getting schemas...');

            client.query("CREATE TABLE if not exists tracked_games (userid TEXT, gameId TEXT);");
            done();
        });

        //Make self call to get the tracked games for the user
        this.getUsersTrackedGameIds(userId, (ids) => {
            console.log('INTO CALLBACK');
            var pluckedIds = _.pluck(ids, 'gameid');
            console.log("gameid: " + gameId + "\r\nids : " + JSON.stringify(pluckedIds));

            var isAlreadyContained = false;

            for (var i = 0; i < ids.length; i++) {
                if (ids[i].gameid != null && ids[i].gameid.indexOf(gameId) > -1) {
                    isAlreadyContained = true;
                    break;
                }
            }

            //If the game isn't already tracked by the user, add its
            if (!isAlreadyContained) {
                pg.connect(process.env.DATABASE_URL, (err, client, done) => {
                    console.log('inserting data for user: ' + userId);
                    //Prep our query
                    client.query("INSERT INTO tracked_games VALUES ($1, $2);", [userId, gameId], (err, res) => {
                        doneCallback();
                        done();
                    });
                });
            } else {
                doneCallback("Game Already Added");
            }
        });
    }

    //Remove a game from the database for a userId
    static removeGameIDFromUser(gameId, userId, doneCallback) {
        pg.connect(process.env.DATABASE_URL, (err, client, done) => {

            client.query("CREATE TABLE if not exists tracked_games (userid TEXT, gameId TEXT);");

            client.query("DELETE FROM tracked_games WHERE userid=($1) AND gameId=($2);", [userId, gameId], () => {
                doneCallback();
                done();
            });
        });

    }

    static getUsersTrackedGameIds(userid, handleUserIds) {
        console.log(process.env.DATABASE_URL);
        console.log("Entered get user tracked games");
        pg.connect(process.env.DATABASE_URL, (err, client, done) => {
            if (err) {
                console.log(err);
            } else {
                client.query("CREATE TABLE if not exists tracked_games (userid TEXT, gameId TEXT);");

                console.log('GETTING USER TRACKED GAMES');
                //Select all tracked gameId's for that userId
                client.query("SELECT gameId FROM tracked_games WHERE userid=($1);", [userid], (err, res) => {
                    console.log("got FROM DATABASE: " + JSON.stringify(_.filter(res.rows, (item) => item.gameid != "undefined")));
                    //Send back the rows
                    done();
                    handleUserIds(_.filter(res.rows, (item) => item.gameid != "undefined"));
                });
            }
        });
    }
}*/