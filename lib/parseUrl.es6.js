const ParseUrlReg = /^(?<path>[^?#]*)?(\?(?<search>[^#]*))?(#(?<hash>.*))?/;
function parseUrl(url) {
    // @ts-ignore
    return url.match(ParseUrlReg).groups;
}

export default parseUrl;
export { ParseUrlReg };
