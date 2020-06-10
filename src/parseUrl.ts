interface ParsedUrl {
  path: string | undefined
  search: string | undefined
  hash: string | undefined
}

const ParseUrlReg = /^([^?#]*)?(\?([^#]*))?(#(.*))?/

function parseUrl (url: string): ParsedUrl {
  const match = url.match(ParseUrlReg)
  return {
    path: match[1],
    search: match[3],
    hash: match[5]
  }
}

export default parseUrl

export {
  ParseUrlReg,
  ParsedUrl
}
