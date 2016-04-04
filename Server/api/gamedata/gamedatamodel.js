/**
 * Created by Joey on 2/19/16.
 */
var pg = require('pg');
var _=require('underscore-node');


export function getAllTrackedIdsColumn(handleTrackedIds)
{
    try {
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            client.query("CREATE TABLE if not exists tracked_games(userid TEXT, gameId TEXT)");

            client.query("SELECT gameId FROM tracked_games", function (err, res) {
                done();
                handleTrackedIds(res.rows);
            });
        });
    }
    catch(ex)
    {
        console.log(ex.trace());
        console.log(ex);
    }
}
