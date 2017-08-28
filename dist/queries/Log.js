'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getLogs = exports.saveLog = undefined;

var _Log = require('../models/Log');

var _Log2 = _interopRequireDefault(_Log);

var _Projection = require('./Projection');

var _Projection2 = _interopRequireDefault(_Projection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saveLog = function saveLog(LogDocument) {
    new _Log2.default(LogDocument).save(function (err, log) {
        if (err) console.log('Couldn\'t save the log:', err.message, LogDocument);
        return;
    });
};

var getLogs = function getLogs(callback) {
    _Log2.default.find({}, _Projection2.default.Log.find, { sort: { request_timestamp: -1 } }, function (err, foundLogs) {
        return callback(err ? err.message : null, foundLogs);
    });
};

exports.saveLog = saveLog;
exports.getLogs = getLogs;