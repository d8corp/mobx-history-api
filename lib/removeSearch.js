'use strict';

var parseUrl = require('./parseUrl.js');

/**
 * @deprecated Please use `setSearch` with 2 arguments
 */
function removeSearch(url, key) {
    var _a = parseUrl.default(url), _b = _a.path, path = _b === void 0 ? '' : _b, _c = _a.search, search = _c === void 0 ? '' : _c, _d = _a.hash, hash = _d === void 0 ? '' : _d;
    var newSearch = search.replace(new RegExp("(^|&)" + key + "(=[^&]*)?(&|$)"), '&').replace(/(^&|&$)/, '');
    return path + (newSearch ? '?' + newSearch : '') + (hash ? '#' + hash : '');
}

module.exports = removeSearch;
