import _ from 'underscore-node';
import mongojs from 'mongojs';

module.exports = class GameDataModel {

    /**
     * Get all tracked games id's in the database, including duplicated
     *
     * @static
     * @param {any} handleTrackedIds callback with ids (err, ids)
     *
     * @memberOf GameDataModel
     */
    static getAllTrackedIdsColumn(handleTrackedIds) {

        const db = mongojs(process.env.DATABASE_URL, ['userdata']);

        db.userdata.find((err, data) => {
	        err
						? handleTrackedIds(err, null)
	        	: handleTrackedIds(err, _.flatten(_.pluck(data, 'gameids')));
        });
    }
}
