import parseUrl from './parseUrl'
import removeSearch from './removeSearch'

export default function setSearch (url: string, key: string, value?: string): string {
  if (value === undefined) {
    return removeSearch(url, key)
  }
  const {path = '', search = '', hash = ''} = parseUrl(url)
  let newSearch = ''

  const containsKey = new RegExp(`(^|&)${key}(=|&|$)`).test(search)
  const postKey = value ? `=${value}` : ''

  if (containsKey) {
    newSearch = search.replace(new RegExp(`(^|&)${key}(=|=[^&]*)?(&|$)`), `$1${key}${postKey}$3`)
  } else {
    newSearch = `${search ? search + '&' : ''}${key}${postKey}`
  }
  return path + (newSearch ? '?' + newSearch : '') + (hash ? '#' + hash : '')
}
