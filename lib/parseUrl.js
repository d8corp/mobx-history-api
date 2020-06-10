'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ParseUrlReg = /^([^?#]*)?(\?([^#]*))?(#(.*))?/;
function parseUrl(url) {
    var match = url.match(ParseUrlReg);
    return {
        path: match[1],
        search: match[3],
        hash: match[5]
    };
}

exports.ParseUrlReg = ParseUrlReg;
exports.default = parseUrl;
