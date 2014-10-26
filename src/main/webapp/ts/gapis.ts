/// <reference path="ext/gapi/gapi.d.ts" />
/// <reference path="lib.ts" />
/// <reference path="api.ts" />
interface AuthResponse {
    logged:()=>void;
    notlogged:()=>void;
}

interface Resolve {
    success:(response)=>void;
    error:(response)=>void;
    unauthorized?:(response)=>void;
}

interface Error {
    context:string;
    code:number;
    args:any;
}

declare var locale;

var lang = navigator.userLanguage || navigator.language;

function localeMessage(name:string, original:string, args?:any):string {
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

function localeError(error:Error):string {
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

interface Executor {
    execute:(resolver:Resolve)=>void;
}

enum StateLoading{
    loadingGAPI , authenticating, clientLoading, callService, authFail
}


class ClientLoader {
    public static logged:boolean = false;
    public apiUrl;
    public client:string;
    public version:string = 'v1';
    public requireAuth:boolean;
    public cbState:(state:StateLoading)=>void;
    public api:{[index:string]:any};
    private config = {};
    private apiMapDepot:ApiMapDepot;

    constructor(apiMapDepot:ApiMapDepot) {
        this.apiMapDepot = apiMapDepot;
    }

    public defaultResolver:Resolve = {
        success: function (success) {
            console.log(success);
        },
        error: function (error) {
            console.log(error);
        },
        unauthorized: function (unauthorized) {
            console.log(unauthorized);
        }
    }

    public static logout() {
        gapi.auth.setToken(null);
        this.logged = false;
    }

    public login(callback:()=>void) {
        this.checkAuth(false, callback);
    }

    setClientID(clientID:string) {
        this.config['client_id'] = clientID;
    }

    setScope(scope:Array<string>) {
        this.config['scope'] = scope;
    }

    private getAuthConfig = (immediate:boolean)=> {
        this.config['immediate'] = immediate;

        if (!immediate) {
            this.config['approval_prompt'] = 'force';
        }
        return this.config;
    }

    private checkAuth(immediate:boolean, callback:()=>void) {
        var self = this;
        gapi.auth.authorize(self.getAuthConfig(immediate), (response)=> {
            if (response.error) {
                ClientLoader.logged = false
            } else {
                ClientLoader.logged = true;
            }
            callback();
        });
    }

    private callCBState(state:StateLoading) {
        if (this.cbState != null)
            this.cbState(state);
    }

    loadApi(callback?:()=>void) {
        var self = this;

        function callAttributes() {

            self.api = {};

            self.apiMapDepot.afterLoaded(()=> {
                self.attribClient(self.apiMapDepot.getMap(self.client), self.api);
                self.apiMapDepot.setApi(null);
                self.callCBState(StateLoading.callService);
                if (!isNull(callback))callback();
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
            self.callCBState(StateLoading.loadingGAPI);
            gapi.load('auth', ()=> {
                self.callCBState(StateLoading.authenticating);
                self.loadApi(callback);
            });
        } else if (self.requireAuth && !ClientLoader.logged)
            self.checkAuth(true, ()=> {
                if (ClientLoader.logged) {
                    self.callCBState(StateLoading.clientLoading);
                    self.loadApi(callback);
                }
                else {
                    self.callCBState(StateLoading.authFail);
                }
            });
        else if (isNull(gapi.client[self.client])) {
            gapi.client.load(self.client, self.version, ()=> {
                callAttributes();
            }, self.apiUrl);
        } else if (isNull(self.api)) {
            callAttributes();
        } else {
            if (!isNull(callback))callback();
        }
    }

    afterLoad = function () {
        console.log('loaded ' + this.client);
    }

    private attribClient(map:ApiMap, contextApi) {
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
                        map.api[this.mName]({'eval': true}).execute((response)=> {
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
                    execute: function (resolver?:Resolve) {
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
                            arr.sort((a, b)=> {
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
                            map.api[this.mName](self.args).execute((response)=> {
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
                }

            } else {
                contextApi[m] = {};
                obSelf.attribClient(ApiMapDepot.in(map, m), contextApi[m]);
            }
        }
    }


    helpLoader(name) {
        this.client = name;
        this.loadApi();
    }
}

