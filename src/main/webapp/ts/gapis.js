/// <reference path="ext/gapi/gapi.d.ts" />
/// <reference path="lib.ts" />
/// <reference path="api.ts" />

var lang = navigator.userLanguage || navigator.language;

function localeMessage(name, original, args) {
    var localMessage;
    if (isNull(locale[locale.current])) {
        return original;
    }
    localMessage = locale[locale.current];
    if (!isNull(localMessage[name])) {
        return localMessage[name](args);
    }
    return original;
}

function localeError(error) {
    if (!isNull(locale[lang])) {
        return error.message;
    }
    var localError = localError[lang];
    if (!isNull(localeError[error.context])) {
        return error.message;
    }
    localError = localError[error.context];
    if (!isNull(localeError[error.code])) {
        return error.message;
    }
    return localError[error.code](error.args);
}

var StateLoading;
(function (StateLoading) {
    StateLoading[StateLoading["loadingGAPI"] = 0] = "loadingGAPI";
    StateLoading[StateLoading["authenticating"] = 1] = "authenticating";
    StateLoading[StateLoading["clientLoading"] = 2] = "clientLoading";
    StateLoading[StateLoading["callService"] = 3] = "callService";
    StateLoading[StateLoading["authFail"] = 4] = "authFail";
})(StateLoading || (StateLoading = {}));

var ClientLoader = (function () {
    function ClientLoader(apiMapDepot) {
        var _this = this;
        this.version = 'v1';
        this.config = {};
        this.defaultResolver = {
            success: function (success) {
                console.log(success);
            },
            error: function (error) {
                console.log(error);
            },
            unauthorized: function (unauthorized) {
                console.log(unauthorized);
            }
        };
        this.getAuthConfig = function (immediate) {
            _this.config['immediate'] = immediate;

            if (!immediate) {
                _this.config['approval_prompt'] = 'force';
            }
            return _this.config;
        };
        this.afterLoad = function () {
            console.log('loaded ' + this.client);
        };
        this.apiMapDepot = apiMapDepot;
    }
    ClientLoader.logout = function () {
        gapi.auth.setToken(null);
        this.logged = false;
    };

    ClientLoader.prototype.login = function (callback) {
        this.checkAuth(false, callback);
    };

    ClientLoader.prototype.setClientID = function (clientID) {
        this.config['client_id'] = clientID;
    };

    ClientLoader.prototype.setScope = function (scope) {
        this.config['scope'] = scope;
    };

    ClientLoader.prototype.checkAuth = function (immediate, callback) {
        var self = this;
        gapi.auth.authorize(self.getAuthConfig(immediate), function (response) {
            if (response.error) {
                ClientLoader.logged = false;
            } else {
                ClientLoader.logged = true;
            }
            callback();
        });
    };

    ClientLoader.prototype.callCBState = function (state) {
        if (this.cbState != null)
            this.cbState(state);
    };

    ClientLoader.prototype.loadApi = function (callback) {
        var self = this;

        function callAttributes() {
            self.api = {};

            self.apiMapDepot.afterLoaded(function () {
                self.attribClient(self.apiMapDepot.getMap(self.client), self.api);
                self.apiMapDepot.setApi(null);
                self.callCBState(3 /* callService */);
                if (!isNull(callback))
                    callback();
                return self.api;
            });
            var currentApi = gapi.client[self.client];
            var clientCopyApi = {};
            for (var key in currentApi) {
                if (key != 'kB') {
                    clientCopyApi[key] = currentApi[key];
                }
            }
            currentApi = {};
            currentApi[self.client] = clientCopyApi;
            self.apiMapDepot.setApi(currentApi);
        }

        if (isNull(gapi.auth)) {
            self.callCBState(0 /* loadingGAPI */);
            gapi.load('auth', function () {
                self.callCBState(1 /* authenticating */);
                self.loadApi(callback);
            });
        } else if (self.requireAuth && !ClientLoader.logged)
            self.checkAuth(true, function () {
                if (ClientLoader.logged) {
                    self.callCBState(2 /* clientLoading */);
                    self.loadApi(callback);
                } else {
                    self.callCBState(4 /* authFail */);
                }
            });
        else if (isNull(gapi.client[self.client])) {
            gapi.client.load(self.client, self.version, function () {
                callAttributes();
            }, self.apiUrl);
        } else if (isNull(self.api)) {
            callAttributes();
        } else {
            if (!isNull(callback))
                callback();
        }
    };

    ClientLoader.prototype.attribClient = function (map, contextApi) {
        var obSelf = this;

        for (var m in map.api) {
            function load(current) {
                if (typeof (current) === 'undefined' || typeof (current[m]) === 'undefined') {
                    return null;
                } else {
                    return current[m];
                }
            }

            if (typeof (map.api[m]) === 'function') {
                var currentValidations;
                contextApi[m] = {
                    args: undefined,
                    mName: m,
                    validations: load(map.validations),
                    fields: load(map.fields),
                    errors: map.errors,
                    validator: map.validator,
                    lang: map.lang,
                    argsEval: function () {
                        var self = this;
                        map.api[this.mName]({ 'eval': true }).execute(function (response) {
                            var result = response.result;
                            self.args = {};
                            self['validations'] = {};
                            self['alias'] = {};
                            for (var r in result) {
                                var type = result[r]['type'];
                                var validations = result[r]['validations'];
                                var al = result[r]['alias'];
                                if (!isNull(validations))
                                    self['validations'][r] = validations;
                                if (!isNull(al))
                                    self['alias'][r] = al;
                                if (type === 'String') {
                                    self.args[r] = '';
                                } else if (type === 'List') {
                                    self.args[r] = [];
                                } else if (type === 'boolean') {
                                    self.args[r] = true;
                                }
                            }
                            self.response = response.result;
                        });
                    },
                    execute: function (resolver) {
                        var self = this;
                        if (isNull(resolver))
                            resolver = obSelf.defaultResolver;

                        function getErrorMessage(val, name) {
                            var template = self['errors'][val]['lang'][self.lang]['template'];
                            var render = [];
                            var localField = self.fields[name][self.lang];
                            render[0] = template[0] + localField + template[1];
                            for (var i = 2; i < template.length; i++) {
                                render[i - 1] = template[i];
                            }
                            return render;
                        }

                        function getValidation(arr, name, value) {
                            if (!isNull(arr)) {
                                for (var val in arr) {
                                    var current = arr[val]['id'];
                                    var checked = self['validator'][current](value);
                                    if (!checked) {
                                        return getErrorMessage(current, name);
                                    }
                                }
                            }
                            return null;
                        }

                        var response = null;

                        function createErrorResponse(validationErrors) {
                            if (Object.keys(validationErrors).length == 0) {
                                return;
                            }
                            for (var k in validationErrors) {
                                var template = validationErrors[k];
                                if (template.length == 1) {
                                    validationErrors[k] = template[0];
                                } else {
                                    validationErrors[k]['template'] = template;
                                }
                            }
                            response = validationErrors;
                        }

                        function orderedValidations(current) {
                            var arr = [];
                            for (var c in self.validations[current]) {
                                arr.push({
                                    'id': c,
                                    'priority': self.validations[current][c]['priority']
                                });
                            }
                            arr.sort(function (a, b) {
                                return b.priority - a.priority;
                            });
                            return arr;
                        }

                        if (!isNull(self.args) && !isNull(self['validations'])) {
                            var validationError = {};
                            for (var p in self.validations) {
                                var sorted = orderedValidations(p);
                                var current = getValidation(sorted, p, self['args'][p]);
                                if (current != null) {
                                    validationError[p] = current;
                                }
                            }
                            createErrorResponse(validationError);
                        }

                        if (response == null) {
                            map.api[this.mName](self.args).execute(function (response) {
                                if (isNull(response.error)) {
                                    resolver.success(response.result);
                                } else {
                                    resolver.error(response.error.message);
                                }
                            });
                        } else {
                            resolver.success({
                                'code': -1,
                                'message': response
                            });
                        }
                    }
                };
            } else {
                contextApi[m] = {};
                obSelf.attribClient(ApiMapDepot.in(map, m), contextApi[m]);
            }
        }
    };

    ClientLoader.prototype.helpLoader = function (name) {
        this.client = name;
        this.loadApi();
    };
    ClientLoader.logged = false;
    return ClientLoader;
})();
//# sourceMappingURL=gapis.js.map
