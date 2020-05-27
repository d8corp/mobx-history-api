interface ParsedUrl {
  path: string | undefined
  search: string | undefined
  hash: string | undefined
}

const ParseUrlReg = /^(?<path>[^?#]*)?(\?(?<search>[^#]*))?(#(?<hash>.*))?/

function parseUrl (url: string): ParsedUrl {
  // @ts-ignore
  return url.match(ParseUrlReg).groups
}

export default parseUrl

export {
  ParseUrlReg,
  ParsedUrl
}
