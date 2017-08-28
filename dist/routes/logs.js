'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Response = require('../Response');

var _Log = require('../queries/Log');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
 * GET /logs
 */
var logs = function logs(req, res) {
    var _ref = new _Response.Response(req, res, false),
        send = _ref.send;

    (0, _Log.getLogs)(function (err, foundLogs) {
        if (err) return send(500, 'ERR', err);

        var response = foundLogs.length > 0 ? _Response.R.LOGS_FOUND : _Response.R.LOGS_NFOUND;

        send.apply(undefined, _toConsumableArray(response).concat([foundLogs]));
        return;
    });
};

exports.default = logs;