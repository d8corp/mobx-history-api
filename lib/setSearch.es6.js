import parseUrl from './parseUrl.es6.js';
import removeSearch from './removeSearch.es6.js';

function setSearch(url, key, value) {
    if (value === undefined) {
        return removeSearch(url, key);
    }
    const { path = '', search = '', hash = '' } = parseUrl(url);
    let newSearch = '';
    const containsKey = new RegExp(`(^|&)${key}(=|&|$)`).test(search);
    const postKey = value ? `=${value}` : '';
    if (containsKey) {
        newSearch = search.replace(new RegExp(`(^|&)${key}(=|=[^&]*)?(&|$)`), `$1${key}${postKey}$3`);
    }
    else {
        newSearch = `${search ? search + '&' : ''}${key}${postKey}`;
    }
    return path + (newSearch ? '?' + newSearch : '') + (hash ? '#' + hash : '');
}

export default setSearch;
