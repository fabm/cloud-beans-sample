function getDate(arg) {
    return new Date(arg[0], arg[1], arg[2]);
}

var validator = {
    //not null
    //not null
    1001: function (arg) {
        if (typeof (arg) === "undefined" || arg == null) {
            return false;
        } else if (arg == "") {
            return false;
        }
        return true;
    },
    //email format
    //email format
    1002: function (arg) {
        return /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(arg);
    },
    //size
    //size
    1003: function (arg) {
        if (arg['value'] > arg['min'] && arg['value'] < arg['max']) {
            return true;
        }
    },
    //min
    //min
    1004: function (arg) {
        return (arg['value'] > arg['min']);
    },
    //max
    //max
    1005: function (arg) {
        return (arg['value'] < arg['max']);
        ;
    },
    //future date
    //future date
    1006: function (arg) {
        return getDate(arg) > new Date();
    },
    //past date
    //past date
    1007: function (arg) {
        return getDate(arg) < new Date();
    },
    // between dates
    // between dates
    1008: function (arg) {
        var argDates = [getDate(arg[0]), getDate(arg[1])];
        argDates = argDates.sort();
        var now = new Date();

        return argDates[1] < now && now < argDates[0];
    }
};
//# sourceMappingURL=validator.js.map
