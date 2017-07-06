/**
 * Created by Joey on 4/3/16.
 */
'use strict'

export default function (app, io) {
    //Set up our routes
    let extDataRouter = require('./api/gamedata');
    let userDataRouter = require('./api/userdata');
    app.use('/info', extDataRouter);
    app.use('/userdata', userDataRouter);

    //Authentication Route
    app.use('/auth', require('./auth')(io));

}
