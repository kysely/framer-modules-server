'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Response = require('../Response');

var _Module = require('../queries/Module');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
 * GET /checkName/:moduleName
 */
var checkName = function checkName(req, res) {
    var _ref = new _Response.Response(req, res),
        send = _ref.send;

    (0, _Module.moduleExists)(req.params.moduleName, function (err, exists, unique_name) {
        if (err) return send(500, 'ERR', err);

        var availability = exists ? _Response.R.NAME_TAKEN : _Response.R.NAME_OK;

        var details = {
            available: !exists,
            name: req.params.moduleName,
            unique_name: unique_name
        };

        send.apply(undefined, _toConsumableArray(availability).concat([details]));
        return;
    });
};

exports.default = checkName;