'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Response = require('../Response');

var _Module = require('../queries/Module');

var _serverConfig = require('../serverConfig');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
 * PUT /installed/:moduleName
 * PUT /uninstalled/:moduleName
 */
var updateStats = function updateStats(req, res) {
    var _ref = new _Response.Response(req, res),
        send = _ref.send;

    if (req.headers['user-agent'] !== _serverConfig.ALLOWED_UA) return send.apply(undefined, _toConsumableArray(_Response.R.STATS_DENY));

    var update = req.url.match(/^\/i/) ? { installed_count: 1 } : { uninstalled_count: 1 };

    (0, _Module.updateModuleStats)(req.params.moduleName, update, function (err, updatedModule) {
        if (err) return send(500, 'ERR', err);

        send.apply(undefined, _toConsumableArray(_Response.R.STATS_OK));
        return;
    });
};

exports.default = updateStats;