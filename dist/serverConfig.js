'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ALLOWED_UA = exports.MODULES_PER_PAGE = exports.DEV = exports.SERVER_PORT = exports.MONGO_URI = undefined;

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CL_ARG = (0, _minimist2.default)(process.argv);

var DEV = CL_ARG.DEV || false;
var ALLOWED_UA = 'Framer Modules';
var MODULES_PER_PAGE = 2;
var SERVER_PORT = process.env.PORT || 3000;
var MONGO_PASSWORD = process.env.MONGO_PASSWORD || CL_ARG.MONGO_PASSWORD;
var MONGO_USER = 'framermodules';
var MONGO_DATABASE = 'modules';
var MONGO_REPSET = 'framermodules-shard-0';
var MONGO_NODES = ['framermodules-shard-00-00-9qvzk.mongodb.net:27017', 'framermodules-shard-00-01-9qvzk.mongodb.net:27017', 'framermodules-shard-00-02-9qvzk.mongodb.net:27017'];

/* If you're developing and want to connect to your
   localhost mongo server, just modify the MONGO_URI variable
   e.g. const MONGO_URI = 'mongodb://localhost:27017/modules' */
var MONGO_URI = 'mongodb://' + MONGO_USER + ':' + MONGO_PASSWORD + '@' + MONGO_NODES.join(',') + ('/' + MONGO_DATABASE + '?ssl=true&replicaSet=' + MONGO_REPSET + '&authSource=admin');

exports.MONGO_URI = MONGO_URI;
exports.SERVER_PORT = SERVER_PORT;
exports.DEV = DEV;
exports.MODULES_PER_PAGE = MODULES_PER_PAGE;
exports.ALLOWED_UA = ALLOWED_UA;