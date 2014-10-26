declare module gapi {
    export function load(lib:string, callback:()=>void):void;
}

declare module gapi.client {
    export var userBH:any;

    export function load(name:string, version:string, callback:() => void, rootApi:string):void;
}

interface ResponseError {
    code:number;
    message:string;
}

interface ResponseCallbacks {
    responseCallback:(response:any)=>void;
    responseCallbackError:(response:ResponseError)=>void;
}

class Log {
    static prt(msg:any) {
        window.console.log(msg);
    }

    static prtError(msg:any) {
        window.console.error(msg);
    }

    static cbr(response):void {
        window.console.log(response);
    }

    static cbf(response):()=>void{
        return ()=>{
            Log.prt(response);
        }
    }

    static transfer(obje):(objo)=>void{
        var fn = (objo)=>{
            obje = obje;
        };
        return fn;
    }
}

function isNull(parameter:any):boolean {
    if (parameter == undefined || parameter == null)
        return true;
    return false;
}

var isLocal:boolean = window.location.hostname == 'localhost';