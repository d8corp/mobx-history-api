'use strict';

var tslib = require('tslib');
var mobx = require('mobx');

var History = /** @class */ (function () {
    function History(locales, key) {
        var _this = this;
        if (locales === void 0) { locales = ''; }
        if (key === void 0) { key = 'mobx-history-api v1.1'; }
        this._url = location.pathname + location.search + location.hash;
        this.locales = locales;
        this.key = key;
        this.defaultState = {
            key: key,
            steps: []
        };
        var state = window.history.state;
        if ((state === null || state === void 0 ? void 0 : state.key) === key) {
            this.state = state;
        }
        else {
            this.state = this.defaultState;
        }
        var listener = function (_a) {
            var state = _a.state;
            return _this.onChange(state);
        };
        window.addEventListener('popstate', listener);
        this.destructor = function () { return window.removeEventListener('popstate', listener); };
    }
    History.prototype.onChange = function (state) {
        var pathname = location.pathname, search = location.search, hash = location.hash;
        var oldState = this.state;
        this.state = state && this.key === state.key ? state : this.defaultState;
        this._url = pathname + search + hash;
        if (!state || this.key !== state.key || (oldState && this.key === oldState.key && oldState.steps.length > state.steps.length)) {
            this.movement = 'back';
        }
        else {
            this.movement = 'forward';
        }
    };
    Object.defineProperty(History.prototype, "locale", {
        get: function () {
            var locales = this.locales;
            if (locales) {
                var match = this._url.match(new RegExp("^/(" + locales + ")(/|\\?|#|$)"));
                return match ? match[1] : '';
            }
            return '';
        },
        set: function (locale) {
            var _this = this;
            var _a = this, locales = _a.locales, currentLocale = _a.locale;
            if (locales && locale !== currentLocale && (!locale || new RegExp("^(" + locales + ")$").test(locale))) {
                var _b = this, url_1 = _b.url, steps_1 = _b.state.steps;
                var position_1 = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                this.changeState(function (newUrl) {
                    window.history.pushState({
                        key: _this.key,
                        steps: tslib.__spread(steps_1, [{
                                url: url_1,
                                position: position_1
                            }])
                    }, null, newUrl);
                }, locale, url_1, -1);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "localUrl", {
        get: function () {
            return this._url;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "url", {
        get: function () {
            var _a = this, locales = _a.locales, _url = _a._url;
            return locales ? _url.replace(new RegExp("^/(" + locales + ")((/)|(\\?|#|$))"), '/$4') : _url;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "path", {
        get: function () {
            return this.url.replace(/[?#].*/, '');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "hash", {
        get: function () {
            var math = this.url.match(/^[^#]*#(.+)/);
            return math ? math[1] : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "href", {
        get: function () {
            return this.url.replace(/#.*/, '');
        },
        enumerable: false,
        configurable: true
    });
    History.prototype.search = function (key) {
        return this.get("^[^?#]*\\?([^#]*\\&)*" + key + "=([^#&]*)", 2);
    };
    History.prototype.back = function (is, def, scrollFirst) {
        if (def === void 0) { def = '/'; }
        if (scrollFirst === void 0) { scrollFirst = false; }
        if (is) {
            if (typeof is !== 'function') {
                var regexp_1 = is;
                is = function (url) { return regexp_1.test(url); };
            }
            var steps = this.state.steps;
            for (var i = steps.length - 1; i > -1; i--) {
                var step = steps[i];
                if (is(step.url)) {
                    return this.push(step.url, step.position, scrollFirst);
                }
            }
            this.push(def, 0, scrollFirst);
        }
        else if (scrollFirst) {
            var steps = this.state.steps;
            this.scroll(steps[steps.length - 1].position, function () { return window.history.back(); });
        }
        else {
            window.history.back();
        }
        return this;
    };
    History.prototype.forward = function () {
        window.history.forward();
        return this;
    };
    History.prototype.go = function (delta) {
        window.history.go(delta);
        return this;
    };
    History.prototype.replace = function (url, position, scrollFirst) {
        var _this = this;
        if (position === void 0) { position = 0; }
        if (scrollFirst === void 0) { scrollFirst = false; }
        this.changeState(function (newUrl) {
            window.history.replaceState(_this.state, null, newUrl);
        }, this.locale, url, position, scrollFirst);
        return this;
    };
    History.prototype.push = function (url, position, scrollFirst) {
        var _this = this;
        if (position === void 0) { position = 0; }
        if (scrollFirst === void 0) { scrollFirst = false; }
        var _a = this, currentUrl = _a.url, steps = _a.state.steps;
        var top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.changeState(function (newUrl) {
            if (currentUrl !== url) {
                window.history.pushState({
                    key: _this.key,
                    steps: tslib.__spread(steps, [{
                            url: currentUrl,
                            position: top
                        }])
                }, null, newUrl);
            }
        }, this.locale, url, position, scrollFirst);
        return this;
    };
    History.prototype.scroll = function (position, callback) {
        if (callback) {
            var top_1 = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            this.scroll(position);
            var count_1 = 0;
            var interval_1 = setInterval(function () {
                var currentTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if (currentTop === top_1 || count_1++ === 30) {
                    clearInterval(interval_1);
                    callback();
                }
                else {
                    top_1 = currentTop;
                }
            }, 100);
        }
        else if (typeof position === 'string') {
            var element = document.querySelector(position);
            if (element) {
                element.scrollIntoView();
            }
            else {
                this.scroll(0);
            }
        }
        else if (position > -1) {
            var top_2 = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (top_2 !== position) {
                document.documentElement.scrollTop = document.body.scrollTop = position;
            }
        }
        return this;
    };
    History.prototype.is = function (reg) {
        var _this = this;
        if (!this.isCache) {
            this.isCache = {};
        }
        if (!this.isCache[reg]) {
            var regExp_1 = new RegExp(reg);
            this.isCache[reg] = mobx.computed(function () { return regExp_1.test(_this.url); });
        }
        return this.isCache[reg].get();
    };
    History.prototype.get = function (reg, index, defaultValue) {
        var _this = this;
        if (index === void 0) { index = 0; }
        if (defaultValue === void 0) { defaultValue = ''; }
        if (!this.getCache) {
            this.getCache = {};
        }
        if (!this.getCache[index]) {
            this.getCache[index] = {};
        }
        if (!this.getCache[index][reg]) {
            var regExp_2 = new RegExp(reg);
            this.getCache[index][reg] = mobx.computed(function () {
                var result = regExp_2.exec(_this.url);
                return result ? result[index] || '' : defaultValue;
            });
        }
        return this.getCache[index][reg].get();
    };
    History.prototype.changeState = function (callback, locale, url, position, scrollFirst) {
        var _this = this;
        var mainCallback = function () {
            if (locale) {
                var match = url.match(/^([^?#]*)(.*)/);
                callback(match[1] === '/' ? "/" + locale + match[2] : "/" + locale + url);
            }
            else {
                callback(url);
            }
            _this.onChange(window.history.state);
        };
        if (scrollFirst) {
            this.scroll(position, mainCallback);
        }
        else {
            mainCallback();
            this.scroll(position);
        }
    };
    tslib.__decorate([
        mobx.observable.ref
    ], History.prototype, "movement", void 0);
    tslib.__decorate([
        mobx.observable.ref
    ], History.prototype, "state", void 0);
    tslib.__decorate([
        mobx.observable.ref
    ], History.prototype, "locales", void 0);
    tslib.__decorate([
        mobx.observable.ref
    ], History.prototype, "_url", void 0);
    tslib.__decorate([
        mobx.action
    ], History.prototype, "onChange", null);
    tslib.__decorate([
        mobx.computed
    ], History.prototype, "locale", null);
    tslib.__decorate([
        mobx.computed
    ], History.prototype, "url", null);
    tslib.__decorate([
        mobx.computed
    ], History.prototype, "path", null);
    tslib.__decorate([
        mobx.computed
    ], History.prototype, "hash", null);
    tslib.__decorate([
        mobx.computed
    ], History.prototype, "href", null);
    return History;
}());

module.exports = History;
