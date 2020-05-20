import parseUrl from './parseUrl.es6.js';

function removeSearch(url, key) {
    const { path = '', search = '', hash = '' } = parseUrl(url);
    const newSearch = search.replace(new RegExp(`(^|&)${key}(=[^&]*)?(&|$)`), '&').replace(/(^&|&$)/, '');
    return path + (newSearch ? '?' + newSearch : '') + (hash ? '#' + hash : '');
}

export default removeSearch;
