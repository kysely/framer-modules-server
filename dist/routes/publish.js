'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.publishNew = exports.tryNew = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _Response = require('../Response');

var _Module = require('../queries/Module');

var _JSONparser = require('../JSONparser');

var _JSONparser2 = _interopRequireDefault(_JSONparser);

var _uniqueName = require('../uniqueName');

var _uniqueName2 = _interopRequireDefault(_uniqueName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var explodeGitHubURL = function explodeGitHubURL(gitHubURL) {
    var userRepoBranch = void 0;
    var userRepo = gitHubURL.replace(/^.+\.com\/|\.git|\/$/g, '');

    if (userRepo.indexOf('tree') !== -1) {
        userRepoBranch = userRepo.replace(/\/tree/, '');
    } else {
        userRepoBranch = userRepo + '/master';
    }

    var _userRepoBranch$split = userRepoBranch.split('/'),
        _userRepoBranch$split2 = _slicedToArray(_userRepoBranch$split, 3),
        author = _userRepoBranch$split2[0],
        repo = _userRepoBranch$split2[1],
        branch = _userRepoBranch$split2[2];

    return {
        repoURL: 'https://raw.githubusercontent.com/' + userRepoBranch + '/',
        author: author, repo: repo, branch: branch
    };
};

var checkModuleJSON = function checkModuleJSON(gitHubURL, callback) {
    var _explodeGitHubURL = explodeGitHubURL(gitHubURL),
        author = _explodeGitHubURL.author,
        repo = _explodeGitHubURL.repo,
        branch = _explodeGitHubURL.branch,
        repoURL = _explodeGitHubURL.repoURL;

    var moduleJsonUrl = _url2.default.resolve(repoURL, 'module.json');

    _request2.default.get(moduleJsonUrl, function (err, res, moduleString) {
        if (err || res.statusCode !== 200) {
            var errorResponse = [err ? 500 : res.statusCode, 'ERR', err ? err.message : _Response.R.JSON_FAIL];
            return callback(errorResponse, null);
        }

        (0, _JSONparser2.default)(moduleString, function (err, parsedJSON) {
            if (err) {
                var _errorResponse = [].concat(_toConsumableArray(_Response.R.PARSE_FAIL), [err.message]);
                return callback(_errorResponse, null);
            }

            var responseObject = {
                module: parsedJSON,
                request: gitHubURL,
                author: author, repo: repo, branch: branch
            };

            return callback(null, responseObject);
        });
    });
};

var parseNewModule = function parseNewModule(fetchRes) {
    var newModuleObject = fetchRes.module;

    delete newModuleObject.installed_count;
    delete newModuleObject.uninstalled_count;
    delete newModuleObject.last_updated;

    newModuleObject.github = fetchRes.request;
    newModuleObject.unique_name = (0, _uniqueName2.default)(fetchRes.module.name);
    newModuleObject.last_updated = Date.now();

    return newModuleObject;
};

var handleDuplicate = function handleDuplicate(fetchRes, callback) {
    (0, _Module.findSingleModule)(fetchRes.module.name, function (err, existingModule) {
        if (err) return callback([500, 'ERR', err]);

        var _explodeGitHubURL2 = explodeGitHubURL(existingModule.github),
            authorOfExisting = _explodeGitHubURL2.author;

        if (fetchRes.author === authorOfExisting) {
            return callback([].concat(_toConsumableArray(_Response.R.DUPL_OK), [fetchRes.module]));
        } else {
            return callback([].concat(_toConsumableArray(_Response.R.DUPL_DENY)));
        }
    });
};

var fetchNewModule = function fetchNewModule(gitHubURL, callback) {
    checkModuleJSON(gitHubURL, function (err, fetchRes) {
        if (err) return callback(err);

        // Add correct unique_name and github keys
        fetchRes.module = parseNewModule(fetchRes);

        (0, _Module.isValidModule)(fetchRes.module, function (err) {
            if (err) return callback([200, 'ERR', err]);

            (0, _Module.moduleExists)(fetchRes.module.name, function (err, exists) {
                if (err) return callback([500, 'ERR', err]);
                if (exists) return handleDuplicate(fetchRes, callback);

                return callback([].concat(_toConsumableArray(_Response.R.MOD_FOUND), [fetchRes.module]));
            });
        });
    });
};

/*
 * GET /tryNew/:gitHubURL
 */
var tryNew = function tryNew(req, res) {
    var _ref = new _Response.Response(req, res),
        send = _ref.send;

    fetchNewModule(req.params.gitHubURL, function (resData) {
        send.apply(undefined, _toConsumableArray(resData));
        return;
    });
};

/*
 * POST /publishNew
 */
var publishNew = function publishNew(req, res) {
    var _ref2 = new _Response.Response(req, res),
        send = _ref2.send;

    fetchNewModule(req.body.gitHubURL || '', function (response) {
        var _response = _slicedToArray(response, 4),
            stCode = _response[0],
            resStatus = _response[1],
            resMessage = _response[2],
            resData = _response[3];

        if (resStatus === 'ERR' || resStatus === 'DUPL_DENY') {
            send.apply(undefined, _toConsumableArray(response));
            return;
        }

        (0, _Module.upsertSingleModule)(resData, function (err, upsertedModule) {
            if (err) return send(500, 'ERR', err);

            send.apply(undefined, _toConsumableArray(_Response.R.PUBL_OK).concat([upsertedModule]));
            return;
        });
    });
};

exports.tryNew = tryNew;
exports.publishNew = publishNew;