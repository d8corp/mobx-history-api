import { __decorate } from 'tslib';
import { observable, action, computed } from 'mobx';

let History = /** @class */ (() => {
    class History {
        constructor(locales = '', key = 'mobx-history-api v1.1') {
            this._url = location.pathname + location.search + location.hash;
            this.locales = locales;
            this.key = key;
            this.defaultState = {
                key,
                steps: []
            };
            const { state } = window.history;
            if ((state === null || state === void 0 ? void 0 : state.key) === key) {
                this.state = state;
            }
            else {
                this.state = this.defaultState;
            }
            const listener = ({ state }) => this.onChange(state);
            window.addEventListener('popstate', listener);
            this.destructor = () => window.removeEventListener('popstate', listener);
        }
        onChange(state) {
            const { pathname, search, hash } = location;
            const oldState = this.state;
            this.state = state && this.key === state.key ? state : this.defaultState;
            this._url = pathname + search + hash;
            if (!state || this.key !== state.key || (oldState && this.key === oldState.key && oldState.steps.length > state.steps.length)) {
                this.movement = 'back';
            }
            else {
                this.movement = 'forward';
            }
        }
        get locale() {
            const { locales } = this;
            if (locales) {
                const match = this._url.match(new RegExp(`^/(${locales})(/|\\?|#|$)`));
                return match ? match[1] : '';
            }
            return '';
        }
        set locale(locale) {
            const { locales, locale: currentLocale } = this;
            if (locales && locale !== currentLocale && (!locale || new RegExp(`^(${locales})$`).test(locale))) {
                const { url, state: { steps } } = this;
                const position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                this.changeState(newUrl => {
                    window.history.pushState({
                        key: this.key,
                        steps: [...steps, {
                                url,
                                position
                            }]
                    }, null, newUrl);
                }, locale, url, -1);
            }
        }
        get localUrl() {
            return this._url;
        }
        get url() {
            const { locales, _url } = this;
            return locales ? _url.replace(new RegExp(`^/(${locales})((/)|(\\?|#|$))`), '/$4') : _url;
        }
        get path() {
            return this.url.replace(/[?#].*/, '');
        }
        get hash() {
            const math = this.url.match(/^[^#]*#(.+)/);
            return math ? math[1] : '';
        }
        get href() {
            return this.url.replace(/#.*/, '');
        }
        search(key) {
            return this.get(`^[^?#]*\\?([^#]*\\&)*${key}=([^#&]*)`, 2);
        }
        back(is, def = '/', scrollFirst = false) {
            if (is) {
                if (typeof is !== 'function') {
                    const regexp = is;
                    is = url => regexp.test(url);
                }
                const { steps } = this.state;
                for (let i = steps.length - 1; i > -1; i--) {
                    const step = steps[i];
                    if (is(step.url)) {
                        return this.push(step.url, step.position, scrollFirst);
                    }
                }
                this.push(def, 0, scrollFirst);
            }
            else if (scrollFirst) {
                const { steps } = this.state;
                this.scroll(steps[steps.length - 1].position, () => window.history.back());
            }
            else {
                window.history.back();
            }
            return this;
        }
        forward() {
            window.history.forward();
            return this;
        }
        go(delta) {
            window.history.go(delta);
            return this;
        }
        replace(url, position = 0, scrollFirst = false) {
            this.changeState(newUrl => {
                window.history.replaceState(this.state, null, newUrl);
            }, this.locale, url, position, scrollFirst);
            return this;
        }
        push(url, position = 0, scrollFirst = false) {
            const { url: currentUrl, state: { steps } } = this;
            const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            this.changeState(newUrl => {
                if (currentUrl !== url) {
                    window.history.pushState({
                        key: this.key,
                        steps: [...steps, {
                                url: currentUrl,
                                position: top
                            }]
                    }, null, newUrl);
                }
            }, this.locale, url, position, scrollFirst);
            return this;
        }
        scroll(position, callback) {
            if (callback) {
                let top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                this.scroll(position);
                let count = 0;
                const interval = setInterval(() => {
                    const currentTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                    if (currentTop === top || count++ === 30) {
                        clearInterval(interval);
                        callback();
                    }
                    else {
                        top = currentTop;
                    }
                }, 100);
            }
            else if (typeof position === 'string') {
                const element = document.querySelector(position);
                if (element) {
                    element.scrollIntoView();
                }
                else {
                    this.scroll(0);
                }
            }
            else if (position > -1) {
                const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if (top !== position) {
                    document.documentElement.scrollTop = document.body.scrollTop = position;
                }
            }
            return this;
        }
        is(reg) {
            if (!this.isCache) {
                this.isCache = {};
            }
            if (!this.isCache[reg]) {
                const regExp = new RegExp(reg);
                this.isCache[reg] = computed(() => regExp.test(this.url));
            }
            return this.isCache[reg].get();
        }
        get(reg, index = 0, defaultValue = '') {
            if (!this.getCache) {
                this.getCache = {};
            }
            if (!this.getCache[index]) {
                this.getCache[index] = {};
            }
            if (!this.getCache[index][reg]) {
                const regExp = new RegExp(reg);
                this.getCache[index][reg] = computed(() => {
                    const result = regExp.exec(this.url);
                    return result ? result[index] || '' : defaultValue;
                });
            }
            return this.getCache[index][reg].get();
        }
        changeState(callback, locale, url, position, scrollFirst) {
            const mainCallback = () => {
                if (locale) {
                    const match = url.match(/^([^?#]*)(.*)/);
                    callback(match[1] === '/' ? `/${locale}${match[2]}` : `/${locale}${url}`);
                }
                else {
                    callback(url);
                }
                this.onChange(window.history.state);
            };
            if (scrollFirst) {
                this.scroll(position, mainCallback);
            }
            else {
                mainCallback();
                this.scroll(position);
            }
        }
    }
    __decorate([
        observable.ref
    ], History.prototype, "movement", void 0);
    __decorate([
        observable.ref
    ], History.prototype, "state", void 0);
    __decorate([
        observable.ref
    ], History.prototype, "locales", void 0);
    __decorate([
        observable.ref
    ], History.prototype, "_url", void 0);
    __decorate([
        action
    ], History.prototype, "onChange", null);
    __decorate([
        computed
    ], History.prototype, "locale", null);
    __decorate([
        computed
    ], History.prototype, "url", null);
    __decorate([
        computed
    ], History.prototype, "path", null);
    __decorate([
        computed
    ], History.prototype, "hash", null);
    __decorate([
        computed
    ], History.prototype, "href", null);
    return History;
})();

export default History;
