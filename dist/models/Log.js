'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LogSchema = new _mongoose.Schema({
    request: {
        type: String,
        required: true
    },
    request_timestamp: {
        type: Date,
        required: true,
        default: Date.now()
    },
    request_ip: {
        type: String,
        required: true
    },
    request_ua: {
        type: String,
        required: true
    },
    request_method: {
        type: String,
        required: true
    },
    request_body: {
        type: Object,
        required: false
    },
    response_timestamp: {
        type: Date,
        required: true,
        default: Date.now()
    },
    response_status: {
        type: Object,
        required: true
    },
    response_statusCode: {
        type: Number,
        required: true
    }
});

LogSchema.index({ request_timestamp: -1 });

exports.default = _mongoose2.default.model('Log', LogSchema);