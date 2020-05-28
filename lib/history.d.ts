import { IComputedValue } from 'mobx';
declare type Step = {
    url: string;
    locale: string;
    position: number;
};
declare type Steps = Step[];
declare type State = {
    key: string;
    steps: Steps;
};
declare type ScrollCallback = () => any | void;
declare class History {
    constructor(locale?: string, key?: string);
    protected get defaultState(): State;
    protected readonly key: string;
    movement: 'back' | 'forward' | undefined;
    state: State;
    private _locale;
    get locale(): string;
    set locale(locale: string);
    readonly destructor: () => void;
    protected getCache: {
        [reg: string]: {
            [index: number]: IComputedValue<string>;
        };
    };
    protected isCache: {
        [reg: string]: IComputedValue<boolean>;
    };
    protected onChange(state: State): void;
    setLocale(locale?: string): void;
    get url(): string;
    get path(): string;
    get hash(): string;
    get href(): string;
    search(key: string): string;
    back(reg?: RegExp, def?: string, scrollFirst?: boolean): this;
    forward(): this;
    go(delta: number): this;
    push(url: string, position?: number | string, scrollFirst?: boolean): this;
    scroll(position: number | string, callback?: ScrollCallback): void;
    is(reg: string): boolean;
    get(reg: string, index?: number, defaultValue?: string): string;
}
export default History;
export { Step, Steps, State, ScrollCallback };
