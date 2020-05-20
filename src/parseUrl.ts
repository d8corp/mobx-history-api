export interface ParsedUrl {
  path: string | undefined
  search: string | undefined
  hash: string | undefined
}

export const ParseUrlReg = /^(?<path>[^?#]*)?(\?(?<search>[^#]*))?(#(?<hash>.*))?/

export default function parseUrl (url: string): ParsedUrl {
  // @ts-ignore
  return url.match(ParseUrlReg).groups
}
