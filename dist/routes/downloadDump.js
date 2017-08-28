'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressZip = require('express-zip');

var _expressZip2 = _interopRequireDefault(_expressZip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * GET /downloadDump
 */
var downloadDump = function downloadDump(req, res) {
    res.zip([{
        path: _path2.default.resolve('dump', 'modules', 'modules.bson'),
        name: 'dump/modules/modules.bson'
    }, {
        path: _path2.default.resolve('dump', 'modules', 'logs.bson'),
        name: 'dump/modules/logs.bson'
    }, {
        path: _path2.default.resolve('dump', 'modules', 'modules.metadata.json'),
        name: 'dump/modules/modules.metadata.json'
    }, {
        path: _path2.default.resolve('dump', 'modules', 'logs.metadata.json'),
        name: 'dump/modules/logs.metadata.json'
    }], 'framer_modules_dump.zip');
};

exports.default = downloadDump;