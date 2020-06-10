const ParseUrlReg = /^([^?#]*)?(\?([^#]*))?(#(.*))?/;
function parseUrl(url) {
    const match = url.match(ParseUrlReg);
    return {
        path: match[1],
        search: match[3],
        hash: match[5]
    };
}

export default parseUrl;
export { ParseUrlReg };
