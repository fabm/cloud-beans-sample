var Log = (function () {
    function Log() {
    }
    Log.prt = function (msg) {
        window.console.log(msg);
    };

    Log.prtError = function (msg) {
        window.console.error(msg);
    };

    Log.cbr = function (response) {
        window.console.log(response);
    };

    Log.cbf = function (response) {
        return function () {
            Log.prt(response);
        };
    };

    Log.transfer = function (obje) {
        var fn = function (objo) {
            obje = obje;
        };
        return fn;
    };
    return Log;
})();

function isNull(parameter) {
    if (parameter == undefined || parameter == null)
        return true;
    return false;
}

var isLocal = window.location.hostname == 'localhost';
//# sourceMappingURL=lib.js.map
