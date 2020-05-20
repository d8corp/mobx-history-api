'use strict';

var mobx = require('mobx');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var History = /** @class */ (function () {
    function History(key) {
        var _this = this;
        if (key === void 0) { key = 'mobx-history-api'; }
        this._locale = '';
        this.key = key;
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
            return {
                key: this.key,
                steps: [{
                        locale: this._locale,
                        position: 0,
                        url: location.pathname + location.search + location.hash
                    }]
            };
        },
        enumerable: true,
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
                window.history.replaceState({
                    key: _this.key,
                    steps: __spread(state.steps.slice(0, -1), [__assign(__assign({}, lastStep), { locale: locale })])
                }, null, locale ? '/' + locale + url : url);
            })();
        },
        enumerable: true,
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
    Object.defineProperty(History.prototype, "url", {
        get: function () {
            var steps = this.state.steps;
            return steps[steps.length - 1].url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(History.prototype, "path", {
        get: function () {
            return this.url.replace(/[?#].*/, '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(History.prototype, "hash", {
        get: function () {
            return this.url.replace(/^[^#]*#/, '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(History.prototype, "href", {
        get: function () {
            return this.url.replace(/#.*/, '');
        },
        enumerable: true,
        configurable: true
    });
    History.prototype.search = function (key) {
        return this.get("^[^?#]*\\?([^#]*\\&)*" + key + "=([^#&]*)", 2);
    };
    History.prototype.back = function (reg, def, scrollFirst) {
        if (def === void 0) { def = '/'; }
        if (scrollFirst === void 0) { scrollFirst = false; }
        if (reg) {
            var steps = this.state.steps;
            for (var i = steps.length - 1; i > -1; i--) {
                var step = steps[i];
                var url = step.url;
                if (reg.test(url)) {
                    return this.push(url, step.position, scrollFirst);
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
    History.prototype.push = function (url, position, scrollFirst) {
        var _this = this;
        if (position === void 0) { position = 0; }
        if (scrollFirst === void 0) { scrollFirst = false; }
        var locale = this.locale;
        if (url === this.url)
            return this;
        var steps = this.state.steps;
        var top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        steps[steps.length - 1].position = top;
        var changeUrl = function () {
            window.history.pushState({
                key: _this.key,
                steps: __spread(steps, [{
                        locale: locale,
                        url: url,
                        position: position > -1 ? position : top
                    }])
            }, null, locale ? '/' + locale + url : url);
            _this.onChange(window.history.state);
        };
        if (scrollFirst) {
            this.scroll(position, changeUrl);
        }
        else {
            changeUrl();
            this.scroll(position);
        }
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
            }, 100);
        }
        else if (typeof position === 'string') {
            var element = document.querySelector(position);
            if (element) {
                element.scrollIntoView();
            }
        }
        else if (position > -1) {
            var top_2 = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (top_2 !== position) {
                document.documentElement.scrollTop = document.body.scrollTop = position;
            }
        }
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
    __decorate([
        mobx.observable.ref
    ], History.prototype, "movement", void 0);
    __decorate([
        mobx.observable.ref
    ], History.prototype, "state", void 0);
    __decorate([
        mobx.observable.ref
    ], History.prototype, "_locale", void 0);
    __decorate([
        mobx.computed
    ], History.prototype, "locale", null);
    __decorate([
        mobx.action
    ], History.prototype, "onChange", null);
    __decorate([
        mobx.computed
    ], History.prototype, "url", null);
    __decorate([
        mobx.computed
    ], History.prototype, "path", null);
    __decorate([
        mobx.computed
    ], History.prototype, "hash", null);
    __decorate([
        mobx.computed
    ], History.prototype, "href", null);
    return History;
}());

module.exports = History;
