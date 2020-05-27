'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var decode = require('./decode.js');
var parseUrl = require('./parseUrl.js');
var setSearch = require('./setSearch.js');
var removeSearch = require('./removeSearch.js');
require('tslib');
require('mobx');
var history = require('./history.js');



exports.decode = decode;
exports.ParseUrlReg = parseUrl.ParseUrlReg;
exports.parseUrl = parseUrl.default;
exports.setSearch = setSearch;
exports.removeSearch = removeSearch;
exports.default = history;
