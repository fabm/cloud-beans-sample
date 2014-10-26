/// <reference path="langs.ts" />
/// <reference path="validator.ts" />

interface ApiMap {
    validations:any
    errors:any
    fields:any
    api:any
    validator:any
    lang:string
}

class ApiMapDepot {
    constructor(apiMap:ApiMap) {
        if (apiMap !== null) {
            this.errors = apiMap.errors;
            this.fields = apiMap.fields;
            this.validations = apiMap.validations;
            this.api = apiMap.api;
        }
        this.lang = langs[navigator.language];
        if(typeof (this.lang) === 'undefined'){
            this.lang = 'en';
        }
        this.validator = validator;
    }

    private validations = null;
    private errors = null;
    private fields = null;
    private api = null;
    private lang:string;
    private validator;
    private callBack:()=>void;

    public static in(map:ApiMap, key:string):ApiMap {
        var inner = (object, key)=> {
            if (typeof(object) === 'undefined') {
                return object;
            }
            return object[key];
        }

        return{
            'validations': inner(map.validations, key),
            'errors': map.errors,
            'fields': inner(map.fields, key),
            'validator': map.validator,
            'lang':map.lang,
            'api': inner(map.api, key)
        }
    }


    public setValidations(validations) {
        this.validations = validations;
        if (this.allLoaded()) {
            this.callBack();
        }
    }

    public setErros(errors) {
        this.errors = errors;
        if (this.allLoaded()) {
            this.callBack();
        }
    }

    public setFields(fields) {
        this.fields = fields;
        if (this.allLoaded()) {
            this.callBack();
        }
    }

    public setApi(api) {
        this.api = api;
        if (this.allLoaded()) {
            this.callBack();
        }
    }

    public deleteApi(api) {
        this.api = null;
    }

    public allLoaded():boolean {
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
    }

    public afterLoaded(callback:()=>void) {
        this.callBack = callback;
        if (this.allLoaded()) {
            callback();
        }
    }

    public getMap(client:string):ApiMap {
        var self = this;

        return{
            'validations': self.validations[client],
            'errors': self.errors,
            'validator': self.validator,
            'lang':self.lang,
            'fields': self.fields[client],
            'api': self.api[client]
        };
    }
}

