'use strict';

var parseUrl = require('./parseUrl.js');
var removeSearch = require('./removeSearch.js');

function setSearch(url, key, value) {
    if (value === undefined) {
        return removeSearch(url, key);
    }
    var _a = parseUrl.default(url), _b = _a.path, path = _b === void 0 ? '' : _b, _c = _a.search, search = _c === void 0 ? '' : _c, _d = _a.hash, hash = _d === void 0 ? '' : _d;
    var newSearch = '';
    var containsKey = new RegExp("(^|&)" + key + "(=|&|$)").test(search);
    var postKey = value ? "=" + value : '';
    if (containsKey) {
        newSearch = search.replace(new RegExp("(^|&)" + key + "(=|=[^&]*)?(&|$)"), "$1" + key + postKey + "$3");
    }
    else {
        newSearch = "" + (search ? search + '&' : '') + key + postKey;
    }
    return path + (newSearch ? '?' + newSearch : '') + (hash ? '#' + hash : '');
}

module.exports = setSearch;
