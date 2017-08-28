'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _Module = require('./models/Module');

var _Module2 = _interopRequireDefault(_Module);

var _Log = require('./models/Log');

var _Log2 = _interopRequireDefault(_Log);

var _serverConfig = require('./serverConfig');

var _search = require('./routes/search');

var _search2 = _interopRequireDefault(_search);

var _preset = require('./routes/preset');

var _preset2 = _interopRequireDefault(_preset);

var _module2 = require('./routes/module');

var _module3 = _interopRequireDefault(_module2);

var _updateStats = require('./routes/updateStats');

var _updateStats2 = _interopRequireDefault(_updateStats);

var _checkName = require('./routes/checkName');

var _checkName2 = _interopRequireDefault(_checkName);

var _publish = require('./routes/publish');

var _logs = require('./routes/logs');

var _logs2 = _interopRequireDefault(_logs);

var _downloadDump = require('./routes/downloadDump');

var _downloadDump2 = _interopRequireDefault(_downloadDump);

var _wildcard = require('./routes/wildcard');

var _wildcard2 = _interopRequireDefault(_wildcard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = (0, _express2.default)();
if (_serverConfig.DEV) server.use((0, _cors2.default)()), console.log('!CORS ENABLED');
server.use(_bodyParser2.default.json());
server.use(_bodyParser2.default.urlencoded({ extended: true }));
server.set('json spaces', 2);

_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(_serverConfig.MONGO_URI, { config: { autoIndex: true, useMongoClient: true } }, function (err) {
    if (err) return console.error('SERVER FAILED TO CONNECT TO MONGODB:', err.message);
    console.log('SERVER IS CONNECTED TO MONGODB');
});

server.get('/search', _search2.default) // for pagination, use /search/:searchQuery/:page
.get('/search/:searchQuery', _search2.default) // for pagination, use /search/:searchQuery/:page
.get('/preset', _preset2.default).get('/module/:moduleName', _module3.default).put('/installed/:moduleName', _updateStats2.default).put('/uninstalled/:moduleName', _updateStats2.default).get('/checkName/:moduleName', (0, _cors2.default)(), _checkName2.default).get('/tryNew/:gitHubURL', _publish.tryNew).post('/publishNew', _publish.publishNew)
// .get('/logs', logs)
// .get('/downloadDump', downloadDump)
.all('*', _wildcard2.default).listen(_serverConfig.SERVER_PORT, function () {
    console.log('SERVER IS RUNNING ON PORT ' + _serverConfig.SERVER_PORT);
});