'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Response = require('../Response');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
 * ALL /*
 */
var wildcard = function wildcard(req, res) {
    var _ref = new _Response.Response(req, res),
        send = _ref.send;

    send.apply(undefined, _toConsumableArray(_Response.R.NOT_FOUND));
    return;
};

exports.default = wildcard;