var bcrypt = require('bcrypt-nodejs');
var pg = require('pg');

module.exports = class User {
    constructor(userid, password) {
        this.userid = userid.toLowerCase();
        this.password = password
        console.log(this.userid + this.password);
    };

    /**
     * Check if the user exists in the database
     */
    static findUser(email, callback) {
        var username = email.toLowerCase();
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                client.query("CREATE TABLE if not exists user_accounts (userid TEXT, password TEXT);");

                console.log('CHECKING IF USER EXISTS: ' + username);
                //Select all tracked gameId's for that userId
                client.query("SELECT userid FROM user_accounts WHERE userid=($1);", [username], function(err, res) {
                    console.log("got FROM DATABASE: " + JSON.stringify(res.rows));
                    //Send back the rows
                    var exists = res.rows.length > 0;
                    callback(exists, err);
                    done();
                });
            }
        });
    };

    /**
     * Adds a user to the database
     */
    addUser(callback) {
        pg.defaults.ssl = true;
        var _this = this;

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            if (err) throw err;
            console.log('Connected to postgres! Getting schemas...');

            client.query("CREATE TABLE if not exists user_accounts (userid TEXT, password TEXT);");
            done();
        });

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            console.log('INSERTING NEW USER: ' + _this.userid);
            //Prep our query
            client.query("INSERT INTO user_accounts VALUES ($1, $2);", [_this.userid, _this.password], function(err, res) {
                console.log("INSERTED USER");
                callback(err);
                done();
            });
        });
    };

    /**
     * Generate and return a hash for the given password
     */
    static generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    /**
     * Check if the password is valid against the user's hashed password
     */
    checkValidPassword(password, callback) {
        console.log("Entered check user password");
        var _this = this;
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                client.query("CREATE TABLE if not exists user_accounts (userid TEXT, password TEXT);");

                console.log('CHECK VALID PASS FOR: ' + _this.userid);
                //Select all tracked gameId's for that userId
                client.query("SELECT * FROM user_accounts WHERE userid=($1);", [_this.userid], function(err, res) {
                    console.log("GOT FROM DATABASE: " + JSON.stringify(res.rows));
                    //Check if user exists, and if it is correct password
                    if (res.rows.length > 0) {
                        var hashedPass = res.rows[0].password;
                        var isValidPass = bcrypt.compareSync(password, hashedPass);
                        done();
                        callback(isValidPass, err);
                    } else {
                        done();
                        callback(false, err);
                    }
                });
            }
        });
    };
}