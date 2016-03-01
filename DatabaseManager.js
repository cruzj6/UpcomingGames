/**
 * Created by Joey on 2/19/16.
 */
var sqlite3 = require('sqlite3').verbose();
var _=require('underscore-node');

//Public functions
module.exports = {
    addGameIDToUser: function(gameId, userId){addGameIDToUser(gameId, userId)},
    getUsersTrackedGameIds:function(userid, callback){getUsersTrackedGameIds(userid, callback)},
    removeGameIDFromUser:function(gameId, userId){removeGameIDFromUser(gameId, userId)}
};

//Add a gameId to the database for a user that they wish to track
function addGameIDToUser(gameId, userId)
{
    var db = new sqlite3.Database('data.db');
    db.serialize(function() {

        //Create our table if it is not present
        db.run("CREATE TABLE if not exists tracked_games (userid TEXT, gameId TEXT)");

        //Make self call to get the tracked games for the user
        getUsersTrackedGameIds(userId, function(ids)
        {
            //If the game isn't already tracked by the user, add it
            if(!_.contains(ids, gameId))
            {
                //Prep our query
                var stmt = db.prepare("INSERT INTO tracked_games VALUES (?, ?)");

                //Fill in user and gameId
                stmt.run(userId, gameId);
                stmt.finalize();
            }
            db.close();
        });
    });
}

//Remove a game from the database for a userId
function removeGameIDFromUser(gameId, userId)
{
    var db = new sqlite3.Database('data.db');
    db.serialize(function() {

        db.run("CREATE TABLE if not exists tracked_games (userid TEXT, gameId TEXT)");

       var stmt = db.prepare("DELETE FROM tracked_games WHERE userid=(?) AND gameId=(?)")

        //Fill in gameId to be removed and userId
        stmt.run(userId, gameId);
        stmt.finalize();
    });

    db.close();
}

function getUsersTrackedGameIds(userid, handleUserIds)
{
    var db = new sqlite3.Database('data.db');
    db.serialize(function() {

        //Select all tracked gameId's for that userId
        db.all("SELECT gameId FROM tracked_games WHERE userid=(?)", userid, function(err, rows){
            //Send back the rows
            handleUserIds(rows);
        });

    });

    //Close our database
    db.close();
}
