import parseUrl from './parseUrl.es6.js';

/**
 * @deprecated Please use `setSearch` with 2 arguments
 */
function removeSearch(url, key) {
    const { path = '', search = '', hash = '' } = parseUrl(url);
    const newSearch = search.replace(new RegExp(`(^|&)${key}(=[^&]*)?(&|$)`), '&').replace(/(^&|&$)/, '');
    return path + (newSearch ? '?' + newSearch : '') + (hash ? '#' + hash : '');
}

export default removeSearch;
