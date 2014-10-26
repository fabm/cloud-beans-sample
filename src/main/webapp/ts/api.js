/// <reference path="langs.ts" />
/// <reference path="validator.ts" />

var ApiMapDepot = (function () {
    function ApiMapDepot(apiMap) {
        this.validations = null;
        this.errors = null;
        this.fields = null;
        this.api = null;
        if (apiMap !== null) {
            this.errors = apiMap.errors;
            this.fields = apiMap.fields;
            this.validations = apiMap.validations;
            this.api = apiMap.api;
        }
        this.lang = langs[navigator.language];
        if (typeof (this.lang) === 'undefined') {
            this.lang = 'en';
        }
        this.validator = validator;
    }
    ApiMapDepot.in = function (map, key) {
        var inner = function (object, key) {
            if (typeof (object) === 'undefined') {
                return object;
            }
            return object[key];
        };

        return {
            'validations': inner(map.validations, key),
            'errors': map.errors,
            'fields': inner(map.fields, key),
            'validator': map.validator,
            'lang': map.lang,
            'api': inner(map.api, key)
        };
    };

    ApiMapDepot.prototype.setValidations = function (validations) {
        this.validations = validations;
        if (this.allLoaded()) {
            this.callBack();
        }
    };

    ApiMapDepot.prototype.setErros = function (errors) {
        this.errors = errors;
        if (this.allLoaded()) {
            this.callBack();
        }
    };

    ApiMapDepot.prototype.setFields = function (fields) {
        this.fields = fields;
        if (this.allLoaded()) {
            this.callBack();
        }
    };

    ApiMapDepot.prototype.setApi = function (api) {
        this.api = api;
        if (this.allLoaded()) {
            this.callBack();
        }
    };

    ApiMapDepot.prototype.deleteApi = function (api) {
        this.api = null;
    };

    ApiMapDepot.prototype.allLoaded = function () {
        if (this.validations == null) {
            return false;
        }
        if (this.errors == null) {
            return false;
        }
        if (this.fields == null) {
            return false;
        }
        if (this.api == null) {
            return false;
        }
        return true;
    };

    ApiMapDepot.prototype.afterLoaded = function (callback) {
        this.callBack = callback;
        if (this.allLoaded()) {
            callback();
        }
    };

    ApiMapDepot.prototype.getMap = function (client) {
        var self = this;

        return {
            'validations': self.validations[client],
            'errors': self.errors,
            'validator': self.validator,
            'lang': self.lang,
            'fields': self.fields[client],
            'api': self.api[client]
        };
    };
    return ApiMapDepot;
})();
//# sourceMappingURL=api.js.map
