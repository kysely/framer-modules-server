'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Response = require('../Response');

var _Module = require('../queries/Module');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
 * GET /module/:moduleName
 */
var _module = function _module(req, res) {
    var _ref = new _Response.Response(req, res),
        send = _ref.send;

    (0, _Module.findSingleModule)(req.params.moduleName, function (err, foundModule) {
        if (err) return send(500, 'ERR', err);

        var response = foundModule ? _Response.R.MOD_FOUND : _Response.R.MOD_NFOUND;

        send.apply(undefined, _toConsumableArray(response).concat([foundModule]));
        return;
    });
};

exports.default = _module;