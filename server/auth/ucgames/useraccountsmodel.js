import {UserDataModel} from '../../api/userdata/userdatamodel';
import mongojs from 'mongojs';
var bcrypt = require('bcrypt-nodejs');
var db = mongojs(process.env.DATABASE_URL, ['useraccounts']);

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

        db.useraccounts.findOne({ userid: username }, (err, acc) => {
            if (err) {
                callback(false, err);
            }
            else if (acc) {
                callback(true, err);
            }
            else {
                callback(false, err)
            }
        });
    };

    /**
     * Adds a user to the database
     */
    addUser(callback) {
        db.useraccounts.save({
            userid: this.userid,
            hashedpass: this.password
        }, (err) => {
            if(!err){
                //Add user for the data model
                var userDataModel = new UserDataModel(this.userid);
                userDataModel.addUserForData((err, data) => {
                    callback(err);
                });
            }
            else{
                callback(err);
            }
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
        db.useraccounts.findOne({ userid: this.userid }, (err, acc) => {
            if (err) {
                callback(false, err);
            }
            var hashedPass = acc.hashedpass;
            var isValidPass = bcrypt.compareSync(password, hashedPass);
            callback(isValidPass, err);
        });
    };
}