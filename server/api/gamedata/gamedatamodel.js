/**
 * Created by Joey on 2/19/16.
 */
import _ from 'underscore-node';
import mongojs from 'mongojs';

export class GameDataModel {

    /**
     * Get all tracked games id's in the database, including duplicated
     * 
     * @static
     * @param {any} handleTrackedIds callback with ids (err, ids)
     * 
     * @memberOf GameDataModel
     */
    static getAllTrackedIdsColumn(handleTrackedIds) {
        var db = mongojs(process.env.DATABASE_URL, ['userdata']);
        db.userdata.find((err, data) => {
            if(err){
                handleTrackedIds(err, null);
            }
            else{
                var ids = _.flatten(_.pluck(data, 'gameids'));
                handleTrackedIds(err, ids);
            }
        });
    }
}
