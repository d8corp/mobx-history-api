'use strict';

var tslib = require('tslib');
var mobx = require('mobx');

var History = /** @class */ (function () {
    function History(locale, key) {
        var _this = this;
        if (locale === void 0) { locale = ''; }
        if (key === void 0) { key = 'mobx-history-api'; }
        this._locale = '';
        this.key = key;
        this._locale = locale;
        var state = window.history.state;
        if (state && key === state.key) {
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
    Object.defineProperty(History.prototype, "defaultState", {
        get: function () {
            var location = window.location;
            var locale = this._locale;
            var url = location.pathname + location.search + location.hash;
            if (locale) {
                url = url.replace(new RegExp("^/" + locale + "(/|$)"), '/');
            }
            return {
                key: this.key,
                steps: [{
                        locale: locale,
                        position: 0,
                        url: url
                    }]
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (locale) {
            var _this = this;
            mobx.action(function () {
                _this._locale = locale;
                var state = _this.state;
                var lastStep = state.steps[state.steps.length - 1];
                var url = lastStep.url;
                _this.state = {
                    key: _this.key,
                    steps: tslib.__spread(state.steps.slice(0, -1), [tslib.__assign(tslib.__assign({}, lastStep), { locale: locale })])
                };
                window.history.replaceState(_this.state, null, locale ? '/' + locale + (url === '/' ? '' : url) : url);
            })();
        },
        enumerable: false,
        configurable: true
    });
    History.prototype.onChange = function (state) {
        var oldState = this.state;
        this.state = state && this.key === state.key ? state : this.defaultState;
        if (!state || this.key !== state.key || (oldState && this.key === oldState.key && oldState.steps.length > state.steps.length)) {
            this.movement = 'back';
        }
        else {
            this.movement = 'forward';
        }
    };
    History.prototype.setLocale = function (locale) {
        if (locale === void 0) { locale = ''; }
        this._locale = locale;
        var state = this.state;
        var lastStep = state.steps[state.steps.length - 1];
        var url = location.pathname + location.search + location.hash;
        if (locale) {
            url = url.replace(new RegExp("^/" + locale + "(/|$)"), '/');
        }
        this.state = {
            key: this.key,
            steps: tslib.__spread(state.steps.slice(0, -1), [tslib.__assign(tslib.__assign({}, lastStep), { locale: locale,
                    url: url })])
        };
        window.history.replaceState(this.state, null, locale ? '/' + locale + (url === '/' ? '' : url) : url);
    };
    Object.defineProperty(History.prototype, "url", {
        get: function () {
            var steps = this.state.steps;
            return steps[steps.length - 1].url;
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
    History.prototype.back = function (reg, def, scrollFirst) {
        if (def === void 0) { def = '/'; }
        if (scrollFirst === void 0) { scrollFirst = false; }
        if (reg) {
            if (typeof reg !== 'function') {
                var regexp_1 = reg;
                reg = function (step) { return regexp_1.test(step.url); };
            }
            var steps = this.state.steps;
            for (var i = steps.length - 1; i > -1; i--) {
                var step = steps[i];
                if (reg(step)) {
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
    History.prototype.changeState = function (callback, url, position, scrollFirst) {
        var _this = this;
        var locale = this.locale;
        var mainCallback = function () {
            callback(locale ? '/' + locale + (url === '/' ? '' : url) : url);
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
    History.prototype.replace = function (url, position, scrollFirst) {
        var _this = this;
        if (position === void 0) { position = 0; }
        if (scrollFirst === void 0) { scrollFirst = false; }
        var locale = this.locale;
        var steps = this.state.steps;
        this.changeState(function (newUrl) {
            window.history.replaceState({
                key: _this.key,
                steps: tslib.__spread(steps.slice(0, -1), [{
                        locale: locale,
                        url: url,
                        position: position > -1 ? position : steps[steps.length - 1].position
                    }])
            }, null, newUrl);
        }, url, position, scrollFirst);
        return this;
    };
    History.prototype.push = function (url, position, scrollFirst) {
        var _this = this;
        if (position === void 0) { position = 0; }
        if (scrollFirst === void 0) { scrollFirst = false; }
        var _a = this, locale = _a.locale, currentUrl = _a.url;
        var steps = this.state.steps;
        var top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        steps[steps.length - 1].position = top;
        this.changeState(function (newUrl) {
            if (currentUrl !== url) {
                window.history.pushState({
                    key: _this.key,
                    steps: tslib.__spread(steps, [{
                            locale: locale,
                            url: url,
                            position: position > -1 ? position : top
                        }])
                }, null, newUrl);
            }
        }, url, position, scrollFirst);
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
        if (!this.getCache[reg]) {
            this.getCache[reg] = {};
        }
        if (!this.getCache[reg][index]) {
            var regExp_2 = new RegExp(reg);
            this.getCache[reg][index] = mobx.computed(function () {
                var result = regExp_2.exec(_this.url);
                return result ? result[index] || '' : defaultValue;
            });
        }
        return this.getCache[reg][index].get();
    };
    tslib.__decorate([
        mobx.observable.ref
    ], History.prototype, "movement", void 0);
    tslib.__decorate([
        mobx.observable.ref
    ], History.prototype, "state", void 0);
    tslib.__decorate([
        mobx.observable.ref
    ], History.prototype, "_locale", void 0);
    tslib.__decorate([
        mobx.computed
    ], History.prototype, "locale", null);
    tslib.__decorate([
        mobx.action
    ], History.prototype, "onChange", null);
    tslib.__decorate([
        mobx.action
    ], History.prototype, "setLocale", null);
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
