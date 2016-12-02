var bcrypt = require('bcrypt-nodejs');
var pg = require('pg');

export var User = function User() {
    return {
        userid: "",

        /**
         * Check if the user exists in the database
         */
        findUser: function (email, callback) {
            console.log(process.env.DATABASE_URL);
            console.log("Entered check if user exists");
            pg.connect(process.env.DATABASE_URL, function (err, client, done) {
                if (err) {
                    console.log(err);
                }
                else {
                    client.query("CREATE TABLE if not exists user_accounts (userid TEXT, password TEXT);");

                    console.log('CHECKING IF USER EXISTS: ' + email);
                    //Select all tracked gameId's for that userId
                    client.query("SELECT userid FROM user_accounts WHERE userid=($1);", [email], function (err, res) {
                        console.log("got FROM DATABASE: " + JSON.stringify(res.rows));
                        //Send back the rows
                        done();
                        var exists = res.rows.length > 0;
                        callback(exists, err);
                    });
                }
            });
        },

        /**
         * Adds a user to the database
         */
        addUser: function (userId, callback) {
            pg.defaults.ssl = true;

            pg.connect(process.env.DATABASE_URL, function (err, client, done) {
                if (err) throw err;
                console.log('Connected to postgres! Getting schemas...');

                client.query("CREATE TABLE if not exists tracked_games (userid TEXT, gameId TEXT);");
                done();
            });

            //Make self call to get the tracked games for the user
            getUsersTrackedGameIds(userId, function (ids) {
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
                    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
                        console.log('inserting data!!');
                        //Prep our query
                        client.query("INSERT INTO tracked_games VALUES ($1, $2);", [userId, gameId], function (err, res) {
                            doneCallback();
                            done();
                        });
                    });
                }
            });
        },

        /**
         * Generate and return a hash for the given password
         */
        generateHash: function (password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        },

        /**
         * Check if the password is valid against the user's hashed password
         */
        checkValidPassword: function (password) {
            //TODO: retrieve hashed pw
            var hashedPass;
            return bcrypt.compareSync(password, hashedPass);
        }
    }
}
