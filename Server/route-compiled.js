/**
 * Created by Joey on 4/3/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (app) {
    //Set up our routes
    var extDataRouter = require('./api/gamedata');
    var userDataRouter = require('./api/userdata');
    app.use('/info', extDataRouter);
    app.use('/userdata', userDataRouter);

    //Authentication Route
    app.use('/auth', require('./auth'));
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//# sourceMappingURL=route-compiled.js.map