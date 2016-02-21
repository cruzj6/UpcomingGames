/**
 * Created by Joey on 2/19/16.
 */
var sqlite3 = require('sqlite3').verbose();

//Public functions
module.exports = {
    addGameIDToUser: function(gameId, userId){addGameIDToUser(gameId, userId)},
    getUsersTrackedGameIds:function(userid, callback){getUsersTrackedGameIds(userid, callback)}
};

function addGameIDToUser(gameId, userId)
{
    var db = new sqlite3.Database('data.db');
    db.serialize(function() {

        db.run("CREATE TABLE if not exists tracked_games (userid TEXT, gameId TEXT)");
        var stmt = db.prepare("INSERT INTO tracked_games VALUES (?, ?)");

        stmt.run(userId, gameId);
        stmt.finalize();
    });

    db.close();
}

function getUsersTrackedGameIds(userid, callback)
{
    var db = new sqlite3.Database('data.db');
    db.serialize(function() {

        db.all("SELECT gameId FROM tracked_games WHERE userid=(?)", userid, function(err, rows){
            callback(rows);
        });

    });

    db.close();
}
