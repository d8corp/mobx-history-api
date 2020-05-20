export interface ParsedUrl {
    path: string | undefined;
    search: string | undefined;
    hash: string | undefined;
}
export declare const ParseUrlReg: RegExp;
export default function parseUrl(url: string): ParsedUrl;
