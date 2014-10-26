interface Validator{
    [index:number]:(arg:any)=>boolean
}

function getDate(arg:{[index:number]:number}):Date{
    return new Date(arg[0],arg[1],arg[2]);
}

var validator:Validator = {
    //not null
    1001: (arg)=> {
        if (typeof (arg) === "undefined" || arg == null ) {
            return false;
        } else if (arg == "") {
            return false;
        }
        return true;
    },
    //email format
    1002:(arg)=>{
        return /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(arg);
    },
    //size
    1003:(arg)=>{
        if(arg['value'] > arg['min'] && arg['value'] < arg['max']){
            return true;
        }
    },
    //min
    1004:(arg)=>{
        return (arg['value'] > arg['min']);
    },
    //max
    1005:(arg)=>{
        return (arg['value'] < arg['max']);;
    },
    //future date
    1006:(arg)=>{
        return getDate(arg)>new Date();
    },
    //past date
    1007:(arg)=>{
        return getDate(arg)<new Date();
    },
    // between dates
    1008:(arg)=>{
        var argDates = [getDate(arg[0]),getDate(arg[1])];
        argDates = argDates.sort();
        var now:Date = new Date();

        return argDates[1]<now && now<argDates[0];
    }
}

