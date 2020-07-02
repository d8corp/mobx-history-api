declare type ScrollCallback = () => any | void;
declare function scroll(position: number | string, callback?: ScrollCallback): void;
export default scroll;
