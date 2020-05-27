import { __decorate } from 'tslib';
import { observable, computed, action } from 'mobx';

let History = /** @class */ (() => {
    class History {
        constructor(key = 'mobx-history-api') {
            this._locale = '';
            this.key = key;
            const { state } = window.history;
            if (state && key === state.key) {
                this.state = state;
            }
            else {
                this.state = this.defaultState;
            }
            const listener = ({ state }) => this.onChange(state);
            window.addEventListener('popstate', listener);
            this.destructor = () => window.removeEventListener('popstate', listener);
        }
        get defaultState() {
            const { location } = window;
            return {
                key: this.key,
                steps: [{
                        locale: this._locale,
                        position: 0,
                        url: location.pathname + location.search + location.hash
                    }]
            };
        }
        get locale() {
            return this._locale;
        }
        set locale(locale) {
            action(() => {
                this._locale = locale;
                const { state } = this;
                const lastStep = state.steps[state.steps.length - 1];
                const { url } = lastStep;
                window.history.replaceState({
                    key: this.key,
                    steps: [...state.steps.slice(0, -1), Object.assign(Object.assign({}, lastStep), { locale })]
                }, null, locale ? '/' + locale + (url === '/' ? '' : url) : url);
            })();
        }
        onChange(state) {
            const oldState = this.state;
            this.state = state && this.key === state.key ? state : this.defaultState;
            if (!state || this.key !== state.key || (oldState && this.key === oldState.key && oldState.steps.length > state.steps.length)) {
                this.movement = 'back';
            }
            else {
                this.movement = 'forward';
            }
        }
        get url() {
            const { steps } = this.state;
            return steps[steps.length - 1].url;
        }
        get path() {
            return this.url.replace(/[?#].*/, '');
        }
        get hash() {
            return this.url.replace(/^[^#]*#/, '');
        }
        get href() {
            return this.url.replace(/#.*/, '');
        }
        search(key) {
            return this.get(`^[^?#]*\\?([^#]*\\&)*${key}=([^#&]*)`, 2);
        }
        back(reg, def = '/', scrollFirst = false) {
            if (reg) {
                const { steps } = this.state;
                for (let i = steps.length - 1; i > -1; i--) {
                    const step = steps[i];
                    const { url } = step;
                    if (reg.test(url)) {
                        return this.push(url, step.position, scrollFirst);
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
        push(url, position = 0, scrollFirst = false) {
            const { locale } = this;
            if (url === this.url)
                return this;
            const { steps } = this.state;
            const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            steps[steps.length - 1].position = top;
            const changeUrl = () => {
                window.history.pushState({
                    key: this.key,
                    steps: [...steps, {
                            locale,
                            url,
                            position: position > -1 ? position : top
                        }]
                }, null, locale ? '/' + locale + (url === '/' ? '' : url) : url);
                this.onChange(window.history.state);
            };
            if (scrollFirst) {
                this.scroll(position, changeUrl);
            }
            else {
                changeUrl();
                this.scroll(position);
            }
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
                }, 100);
            }
            else if (typeof position === 'string') {
                const element = document.querySelector(position);
                if (element) {
                    element.scrollIntoView();
                }
            }
            else if (position > -1) {
                const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if (top !== position) {
                    document.documentElement.scrollTop = document.body.scrollTop = position;
                }
            }
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
            if (!this.getCache[reg]) {
                this.getCache[reg] = {};
            }
            if (!this.getCache[reg][index]) {
                const regExp = new RegExp(reg);
                this.getCache[reg][index] = computed(() => {
                    const result = regExp.exec(this.url);
                    return result ? result[index] || '' : defaultValue;
                });
            }
            return this.getCache[reg][index].get();
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
    ], History.prototype, "_locale", void 0);
    __decorate([
        computed
    ], History.prototype, "locale", null);
    __decorate([
        action
    ], History.prototype, "onChange", null);
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
