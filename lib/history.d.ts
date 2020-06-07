import { IComputedValue } from 'mobx';
declare type Step = {
    url: string;
    position: number;
};
declare type Steps = Step[];
declare type State = {
    key: string;
    steps: Steps;
};
declare type ScrollCallback = () => any | void;
declare type BackChk = (url: string) => boolean;
declare class History {
    constructor(locales?: string, key?: string);
    readonly destructor: () => void;
    protected readonly defaultState: State;
    protected readonly key: string;
    protected getCache: {
        [reg: number]: {
            [index: string]: IComputedValue<string>;
        };
    };
    protected isCache: {
        [reg: string]: IComputedValue<boolean>;
    };
    movement: 'back' | 'forward' | undefined;
    state: State;
    locales: string;
    protected _url: string;
    protected onChange(state: State): void;
    get locale(): string;
    set locale(locale: string);
    get localUrl(): string;
    get url(): string;
    get path(): string;
    get hash(): string;
    get href(): string;
    search(key: string): string;
    back(is?: RegExp | BackChk, def?: string, scrollFirst?: boolean): this;
    forward(): this;
    go(delta: number): this;
    replace(url: string, position?: number | string, scrollFirst?: boolean): this;
    push(url: string, position?: number | string, scrollFirst?: boolean): this;
    scroll(position: number | string, callback?: ScrollCallback): this;
    is(reg: string): boolean;
    get(reg: string, index?: number, defaultValue?: string): string;
    protected changeState(callback: (newUrl: string) => void, locale: string, url: string, position: number | string, scrollFirst?: boolean): void;
}
export default History;
export { Step, Steps, State, ScrollCallback, BackChk };
