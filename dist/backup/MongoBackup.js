'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _child_process = require('child_process');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Taken from https://github.com/kysely/mongodb-atlas-backup.
   Using absolute paths to mongodump and mongorestore binaries */

var MongoBackup = function () {
    function MongoBackup() {
        var _this = this;

        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, MongoBackup);

        this.user = config.user || '';
        this.pass = config.password || config.pass || '';
        this.repl_set = config.replicaSet || config.replica_set || '';
        this.nodes = config.nodes || [];
        this.database = config.database || config.db || null;

        this.dump = function () {
            return _this.execute(true);
        };
        this.restore = function () {
            return _this.execute(false);
        };
    }

    _createClass(MongoBackup, [{
        key: 'cmdLineArguments',
        value: function cmdLineArguments() {
            return ['--ssl', '--host', this.repl_set + '/' + this.nodes.join(','), '--authenticationDatabase', 'admin', '-u', this.user, '-p', this.pass];
        }
    }, {
        key: 'execute',
        value: function execute() {
            var dump = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var backup = (0, _child_process.spawn)(dump ? './mongodump' : './mongorestore', this.cmdLineArguments());

            backup.stderr.on('data', function (data) {
                console.log(data.toString());
            });
        }
    }]);

    return MongoBackup;
}();

exports.default = MongoBackup;