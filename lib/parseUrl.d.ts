interface ParsedUrl {
    path: string | undefined;
    search: string | undefined;
    hash: string | undefined;
}
declare const ParseUrlReg: RegExp;
declare function parseUrl(url: string): ParsedUrl;
export default parseUrl;
export { ParseUrlReg, ParsedUrl };
