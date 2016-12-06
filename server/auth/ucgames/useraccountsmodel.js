var bcrypt = require('bcrypt-nodejs');
var pg = require('pg');

module.exports = class User {

    constructor(userid, password) {
        this.userid = userid;
        this.password = password
        console.log(this.userid + this.password);
    }
    /**
     * Check if the user exists in the database
     */
    static findUser(email, callback) {
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
    }

    /**
     * Adds a user to the database
     */
    addUser(callback) {
        pg.defaults.ssl = true;
        var _this = this;

        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            if (err) throw err;
            console.log('Connected to postgres! Getting schemas...');

            client.query("CREATE TABLE if not exists user_accounts (userid TEXT, password TEXT);");
            done();
        });

        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            console.log('INSERTING NEW USER: ' + _this.userid);
            //Prep our query
            client.query("INSERT INTO user_accounts VALUES ($1, $2);", [_this.userid, _this.password], function (err, res) {
                console.log("INSERTED USER");
                callback(err);
                done();
            });
        });
    }

    /**
     * Generate and return a hash for the given password
     */
    static generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    /**
     * Check if the password is valid against the user's hashed password
     */
    static checkValidPassword(password, callback) {
        console.log("Entered check if user exists");
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            if (err) {
                console.log(err);
            }
            else {
                client.query("CREATE TABLE if not exists user_accounts (userid TEXT, password TEXT);");

                console.log('CHECK VALID PASS FOR: ' + email);
                //Select all tracked gameId's for that userId
                client.query("SELECT userid FROM user_accounts WHERE userid=($1);", [email], function (err, res) {
                    console.log("got FROM DATABASE: " + JSON.stringify(res.rows));
                    done();
                    //Check if user exists, and if it is correct password
                    if(res.rows > 0)
                    {
                        var hashedPass = res.rows[0].password;
                        var isValidPass = bcrypt.compareSync(password, hashedPass);
                        callback(isValidPass, err);
                    }
                    else{
                        callback(false, err);
                    }
                });
            }
        });
    }
}
