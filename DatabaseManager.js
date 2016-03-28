/**
 * Created by Joey on 2/19/16.
 */
var pg = require('pg');
var _=require('underscore-node');

//Public functions
module.exports = {
    addGameIDToUser: function(gameId, userId, doneCallback){addGameIDToUser(gameId, userId, doneCallback)},
    getUsersTrackedGameIds:function(userid, callback){getUsersTrackedGameIds(userid, callback)},
    removeGameIDFromUser:function(gameId, userId, doneCallback){removeGameIDFromUser(gameId, userId, doneCallback)}
};

//Add a gameId to the database for a user that they wish to track
function addGameIDToUser(gameId, userId, doneCallback)
{
        pg.defaults.ssl = true;

        pg.connect(process.env.DATABASE_URL, function(err, client) {
            if (err) throw err;
            console.log('Connected to postgres! Getting schemas...');

            client.query("CREATE TABLE if not exists tracked_games (userid TEXT, gameId TEXT);");

            //Make self call to get the tracked games for the user
            getUsersTrackedGameIds(userId, function(ids)
            {
                //If the game isn't already tracked by the user, add its
                if(!_.contains(ids, gameId))
                {
                    //Prep our query
                    client.query("INSERT INTO tracked_games VALUES ($1, $2);",[userId, gameId], function(){
                        doneCallback();
                    });
                }
            });
        });
}

//Remove a game from the database for a userId
function removeGameIDFromUser(gameId, userId, doneCallback)
{
    pg.connect(process.env.DATABASE_URL, function(err, client) {

        client.query("CREATE TABLE if not exists tracked_games (userid TEXT, gameId TEXT);");

        client.query("DELETE FROM tracked_games WHERE userid=($1) AND gameId=($2);", [userId, gameId], function(){
            doneCallback();
        });
    });

}

function getUsersTrackedGameIds(userid, handleUserIds)
{
    pg.connect(process.env.DATABASE_URL, function(err, client) {
        client.query("CREATE TABLE if not exists tracked_games (userid TEXT, gameId TEXT);");

        //Select all tracked gameId's for that userId
        client.query("SELECT gameId FROM tracked_games WHERE userid=($1);", [userid])
            .on('end', function(rows) {
                //Send back the rows
                handleUserIds(rows);
            })
        });
}
