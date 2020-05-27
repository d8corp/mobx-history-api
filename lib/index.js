'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var decode = require('./decode.js');
var parseUrl = require('./parseUrl.js');
var setSearch = require('./setSearch.js');
var removeSearch = require('./removeSearch.js');
var history = require('./history.js');
require('mobx');



exports.decode = decode;
exports.ParseUrlReg = parseUrl.ParseUrlReg;
exports.parseUrl = parseUrl.default;
exports.setSearch = setSearch;
exports.removeSearch = removeSearch;
exports.default = history;
