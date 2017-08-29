'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var JSONparser = function JSONparser(jsonString, callback) {
    var filteredJSONString = jsonString.replace(/<.+>/g, '');

    try {
        callback(null, JSON.parse(filteredJSONString));
    } catch (err) {
        callback(err, null);
    }

    return;
};

exports.default = JSONparser;