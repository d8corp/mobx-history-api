import parseUrl from './parseUrl'

/**
 * @deprecated Please use `setSearch` with 2 arguments
 */
function removeSearch (url: string, key: string): string {
  const {path = '', search = '', hash = ''} = parseUrl(url)
  const newSearch = search.replace(new RegExp(`(^|&)${key}(=[^&]*)?(&|$)`), '&').replace(/(^&|&$)/, '')
  return path + (newSearch ? '?' + newSearch : '') + (hash ? '#' + hash : '')
}

export default removeSearch
