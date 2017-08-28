'use strict';

Object.defineProperty(exports, "__esModule", {
                value: true
});
var uniqueName = function uniqueName(beautName) {
                if (typeof beautName !== 'string') return null;

                return beautName.toLowerCase().replace(/[^\w\s-–—]|\d/g, '') // leave words, spaces and dashes
                .replace(/_/g, ' ') // lodash to space
                .trim() // trim excessive whitespace
                .replace(/\s/g, '-') // space to dash
                .replace(/–/g, '-') // en dash to dash
                .replace(/—/g, '-'); // em dash to dash
};

exports.default = uniqueName;