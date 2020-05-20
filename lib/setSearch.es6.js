import parseUrl from './parseUrl.es6.js';

function setSearch(url, key, value) {
    const { path = '', search = '', hash = '' } = parseUrl(url);
    let newSearch = '';
    const containsKey = new RegExp(`(^|&)${key}(=|&|$)`).test(search);
    if (containsKey) {
        newSearch = search.replace(new RegExp(`(^|&)${key}(=|=[^&]*)?(&|$)`), `$1${key}=${value}$3`);
    }
    else {
        newSearch = `${search ? search + '&' : ''}${key}=${value}`;
    }
    return path + (newSearch ? '?' + newSearch : '') + (hash ? '#' + hash : '');
}

export default setSearch;
