'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Response = exports.R = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Log = require('./queries/Log');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var R = {
    _NULL_IP: 'Unknown Request IP',
    _NULL_REQ: 'Unknown Request URI',
    _NULL_MET: 'Unknown Request Method',
    _NULL_UA: 'Unknown User Agent',
    _NO_RES: function _NO_RES(resHandl, resObj) {
        return ['Couldn\'t respond:', resHandl, '\nResponse:', resObj];
    },
    JSON_FAIL: 'Sorry, but I couldn\'t find the \'module.json\' file',
    PARSE_FAIL: [409, 'ERR'],
    NOT_FOUND: [404, 'ERR', 'Not Found'],
    DUPL_OK: [200, 'DUPL_OK', 'Module name is already taken, but allowed to update from the same author.'],
    DUPL_DENY: [200, 'DUPL_DENY', 'Sorry, module name is already taken by someone else.'],
    PUBL_OK: [201, 'OK', 'Module was successfully published.'],
    NAME_OK: [200, 'OK', 'Module name is available for publishing.'],
    NAME_TAKEN: [200, 'TAKEN', 'Module name is taken.'],
    MOD_FOUND: [200, 'OK', 'Your modules are saved in \'data\' key.'],
    MOD_NFOUND: [404, 'NFOUND', 'No modules found.'],
    STATS_OK: [201, 'OK', 'Stats were updated.'],
    STATS_DENY: [403, 'DENY', 'Stats can be updated from Framer Modules only.'],
    LOGS_FOUND: [200, 'OK', 'Logs from the newest to oldest.'],
    LOGS_NFOUND: [404, 'NFOUND', 'No logs to show.'],
    WRONG_PAGE: [403, 'OK', 'Search pagination must start from page 1.']

};

var Response = function () {
    function Response(req, res) {
        var doLog = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        _classCallCheck(this, Response);

        this.res = res;
        this.canRespond = this.res && this.res.status && this.res.json;

        this.send = this.send.bind(this);

        // Don't log Safari automatic reqs for 'favicon' and 'apple-touch-icon'
        this.doLog = req.url.match(/^\/favicon|^\/apple-touch/) ? false : doLog;

        this.log = {
            request_timestamp: Date.now(),
            request_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || R._NULL_IP,
            request: req.url || R._NULL_REQ,
            request_method: req.method || R._NULL_MET,
            request_ua: req.headers['user-agent'] || R._NULL_UA,
            request_body: req.body ? req.body : undefined
        };
    }

    _createClass(Response, [{
        key: 'send',
        value: function send() {
            var statusCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
            var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ERR';
            var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            var ResObj = {
                message: message,
                statusCode: parseInt(statusCode),
                status: status,
                data: data
            };

            this.log.response_timestamp = Date.now();
            this.log.response_status = ResObj.status;
            this.log.response_statusCode = ResObj.statusCode;

            if (this.doLog) (0, _Log.saveLog)(this.log);

            if (!this.canRespond) {
                var _console;

                (_console = console).log.apply(_console, _toConsumableArray(R._NO_RES(this.res, ResObj)));
                return;
            }

            this.res.status(ResObj.statusCode).json(ResObj);
            return;
        }
    }]);

    return Response;
}();

exports.R = R;
exports.Response = Response;