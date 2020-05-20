'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ParseUrlReg = /^(?<path>[^?#]*)?(\?(?<search>[^#]*))?(#(?<hash>.*))?/;
function parseUrl(url) {
    // @ts-ignore
    return url.match(ParseUrlReg).groups;
}

exports.ParseUrlReg = ParseUrlReg;
exports.default = parseUrl;
