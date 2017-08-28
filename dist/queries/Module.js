'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.listAllModules = exports.searchModules = exports.findMultiModules = exports.updateModuleStats = exports.isValidModule = exports.upsertSingleModule = exports.findSingleModule = exports.moduleExists = undefined;

var _Module = require('../models/Module');

var _Module2 = _interopRequireDefault(_Module);

var _uniqueName = require('../uniqueName');

var _uniqueName2 = _interopRequireDefault(_uniqueName);

var _Projection = require('./Projection');

var _Projection2 = _interopRequireDefault(_Projection);

var _serverConfig = require('../serverConfig');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleExists = function moduleExists(name, callback) {
    var searchedName = (0, _uniqueName2.default)(name);

    _Module2.default.count({ unique_name: searchedName }, function (err, count) {
        return callback(err ? err.message : null, count === 0 ? false : true, searchedName);
    });
};

var isValidModule = function isValidModule(moduleObject, callback) {
    new _Module2.default(moduleObject).validate(function (err) {
        if (err) return callback(err.message);
        return callback(null);
    });
};

var findSingleModule = function findSingleModule(name, callback) {
    var searchedName = (0, _uniqueName2.default)(name);

    _Module2.default.findOne({ unique_name: searchedName }, _Projection2.default.Module.find, function (err, foundModule) {
        return callback(err ? err.message : null, foundModule);
    });
};

var upsertSingleModule = function upsertSingleModule(newModule, callback) {
    _Module2.default.findOneAndUpdate({ unique_name: newModule.unique_name }, { $set: newModule }, { upsert: true, setDefaultsOnInsert: true, new: true }, function (err, upsertedModule) {
        return callback(err ? err.message : null, upsertedModule);
    });
};

var updateModuleStats = function updateModuleStats(name, update, callback) {
    var unique_name = (0, _uniqueName2.default)(name);

    _Module2.default.findOneAndUpdate({ unique_name: unique_name }, { $inc: update }, { new: true }, function (err, updatedModule) {
        return callback(err ? err.message : null, updatedModule);
    });
};

var findMultiModules = function findMultiModules(modules, callback) {
    _Module2.default.find({ unique_name: { $in: modules } }, _Projection2.default.Module.find, function (err, foundModules) {
        return callback(err ? err.message : null, foundModules);
    });
};

var searchModules = function searchModules(searchQuery, /*page,*/callback) {
    if (!searchQuery) return callback(null, []);
    // Using aggregation so that we can sort by search relevancy ($meta expression)
    _Module2.default.aggregate({ $match: { $text: { $search: searchQuery } } }, { $sort: { relevancy: { $meta: 'textScore' }, installed_count: -1, uninstalled_count: 1 } },
    // { $skip: MODULES_PER_PAGE * (page-1) },
    // { $limit: MODULES_PER_PAGE },
    { $project: _Projection2.default.Module.find }, function (err, foundModules) {
        return callback(err ? err.message : null, foundModules);
    });
};

var listAllModules = function listAllModules(callback) {
    _Module2.default.aggregate({ $match: { name: { $exists: true } } }, { $sort: { installed_count: -1, uninstalled_count: 1 } }, { $project: _Projection2.default.Module.find }, function (err, foundModules) {
        return callback(err ? err.message : null, foundModules);
    });
};

exports.moduleExists = moduleExists;
exports.findSingleModule = findSingleModule;
exports.upsertSingleModule = upsertSingleModule;
exports.isValidModule = isValidModule;
exports.updateModuleStats = updateModuleStats;
exports.findMultiModules = findMultiModules;
exports.searchModules = searchModules;
exports.listAllModules = listAllModules;