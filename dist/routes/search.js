'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Response = require('../Response');

var _Module = require('../queries/Module');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
 * GET /search/:searchQuery         /:page
 */
var search = function search(req, res) {
    var _ref = new _Response.Response(req, res),
        send = _ref.send;

    // Skip pagination for now; will implement when there are more modules in db
    // if (req.params.page < 1) return send(...R.WRONG_PAGE)


    if (typeof req.params.searchQuery !== 'string') {
        send.apply(undefined, _toConsumableArray(_Response.R.MOD_NFOUND).concat([[]]));
        return;
    } else if (req.params.searchQuery === 'all') {
        (0, _Module.listAllModules)(function (err, foundModules) {
            if (err) return send(500, 'ERR', err);

            var response = foundModules.length > 0 ? _Response.R.MOD_FOUND : _Response.R.MOD_NFOUND;

            send.apply(undefined, _toConsumableArray(response).concat([foundModules]));
            return;
        });
    } else if (req.params.searchQuery.indexOf(':') === 0) {
        var moduleName = req.params.searchQuery.replace(/:/, '');
        (0, _Module.findSingleModule)(moduleName, function (err, foundModule) {
            if (err) return send(500, 'ERR', err);

            var response = foundModule ? _Response.R.MOD_FOUND : _Response.R.MOD_NFOUND;
            var data = foundModule ? [foundModule] : [];

            send.apply(undefined, _toConsumableArray(response).concat([data]));
            return;
        });
    } else {
        (0, _Module.searchModules)(req.params.searchQuery, /*req.params.page,*/function (err, foundModules) {
            if (err) return send(500, 'ERR', err);

            var response = foundModules.length > 0 ? _Response.R.MOD_FOUND : _Response.R.MOD_NFOUND;

            send.apply(undefined, _toConsumableArray(response).concat([foundModules]));
            return;
        });
    }
};

exports.default = search;