import parseUrl from './parseUrl'

export default function removeSearch (url: string, key: string): string {
  const {path = '', search = '', hash = ''} = parseUrl(url)
  const newSearch = search.replace(new RegExp(`(^|&)${key}(=[^&]*)?(&|$)`), '&').replace(/(^&|&$)/, '')
  return path + (newSearch ? '?' + newSearch : '') + (hash ? '#' + hash : '')
}
