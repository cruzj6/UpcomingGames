/**
 * Created by Joey on 4/3/16.
 */
'use strict'
import path from 'path';

export default function(app)
{
    //Finally set up our routes
    var extDataRouter = require('./api/gamedata');
    var userDataRouter = require('./api/userdata');
    app.use('/info', extDataRouter);
    app.use('/userdata', userDataRouter);
}