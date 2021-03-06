//jo stands for Javascript Object
var jo = {};
jo.type1 = type1;
jo.type2 = type2;
jo.getProto = joGetProto;
jo.setProto = joSetProto;
jo.isEmpty = isEmptyObj;
jo.output = outputObj;
jo.create = joCreate;
jo.compare = joCompare;
jo.rawClone = joRawClone;
jo.clone = joClone;

//
function isNullObj(o){
    try { //Object.create(null) & its descendants will throw an error 
        if (typeof o === "object")
            isNaN(o);
        return false;
    } catch (err) {
        return true;
    }
}
//
function type1(o) {
    var to;
    if (o === null)
        return "null";
    if (o instanceof Array)
        return "array";
    to = typeof o;
    if (to === "number" && isNaN(o))
        return "NaN";
    if(isNullObj(o))
        return "nullobj";
    return to;
}
//
function type2(o) {
    var tfo, class2type;
    if (o == null) {
        return o + "";
    }
    if(isNullObj(o))
        return "nullobj";
    tfo = typeof o;
    if (tfo === "number" && isNaN(o))
        return "NaN";
    class2type =
            {
                "[object Boolean]": "boolean",
                "[object Number]": "number",
                "[object String]": "string",
                "[object Function]": "function",
                "[object Array]": "array",
                "[object Date]": "date",
                "[object RegExp]": "regexp",
                "[object Object]": "object",
                "[object Error]": "error",
                "[object Symbol]": "symbol"
            };

    // Support: Android <=2.3 only (functionish RegExp)
    return tfo === "object" || tfo === "function" ?
            class2type[Object.prototype.toString.call(o)] || "object" : tfo;

}
//
function regexpCreate() {

}
//
function joCreate(type, para) {
    switch (type) {
        case 'function':
        case 'regexp':
            return eval('(' + para + ')');
        case 'string':
            return new String(para);
        case 'date':
            return new Date(para);

    }
}

//
function joGetProto(obj) {
    if ((typeof obj !== 'object' && typeof obj !== 'function') || obj === null)
        throw "getProto: object or function expected";

    if (typeof Object.getPrototypeOf === 'function')
        return Object.getPrototypeOf(obj);
    if (typeof obj.__proto__ === 'object' &&
            Object.prototype.isPrototypeOf.call(obj.__proto__, obj))
        return obj.__proto__;
    if (typeof obj.constructor === 'function' &&
            typeof obj.constructor.prototype === 'object' &&
            Object.prototype.isPrototypeOf.call(obj.constructor.prototype, obj))
        return obj.constructor.prototype;

    throw "getProto: Your browser doesn't support 'Object.getPrototypeOf'!";
}
var getProto = joGetProto;
//
function joSetProto(obj, proto) {
    if ((typeof obj !== 'object' && typeof obj !== 'function') || obj === null)
        throw "getProto: object or function expected - obj";

    if (typeof proto !== 'object' && typeof proto !== 'function')
        throw "getProto: object or function expected - proto";

    if (typeof Object.setPrototypeOf === 'function')
        Object.setPrototypeOf(obj, proto);
    else if (typeof obj.constructor === 'function' &&
            typeof obj.constructor.prototype === 'object' &&
            Object.prototype.isPrototypeOf.call(obj.constructor.prototype, obj))
        obj.constructor.prototype = proto;
    else if (typeof obj.__proto__ === 'object' &&
            Object.prototype.isPrototypeOf.call(obj.__proto__, obj))
        obj.__proto__ = proto;
    else
        throw "getProto: Your browser doesn't support 'Object.setPrototypeOf'!";
}
var setProto = joSetProto;

// Finished
function isEmptyObj(e) {
    var i;
    //
    for (i in e)
        return false;
    //
    if (Object.getOwnPropertyNames) {
        i = Object.getOwnPropertyNames(e);
        if (i.length > 0)
            return false;
    }
    return true;
}

// Finished
function joOutput(o, decodeUrl) {
    if (typeof o !== "object")
        return "[Not an object]";
    if (isEmptyObj(o))
        return "[Empty Object]";
    var txt = "<b>NOTE:</b>n for attribute name, d for depth, v for value.<br>";
    txt += "-----------------------------------<br>";
    var depth = 0;

    var sp = function (n) {
        var s = "";
        for (var i = 0; i < n; i++) {
            s += "&nbsp&nbsp&nbsp&nbsp&nbsp.";
        }
        return s;
    };
    var sub = function (obj) {
        var attr;
        for (attr in obj) {
            if ((typeof obj[attr]) !== "object") {
                if (decodeUrl)
                    obj[attr] = decodeURIComponent(obj[attr]);
                txt += sp(depth) + "[n: " + attr + " - d: " + depth + " - v: <b>" + obj[attr] + "</b>]<br>";
            } else {
                txt += sp(depth) + "[n:" + attr + " - d:" + depth + "]...<br>";
                depth++;
                arguments.callee(obj[attr]);
            }
        }
        depth--;
        return txt;
    };
    return sub(o);
}
var outputObj = joOutput;

// Building
// Object.is() ?
function joCompare(o1, o2) {
    var trace1 = [], trace2 = [];

    var sub = function (o1, o2) {
        var o1_t, if_return, proto1, proto2, i, isEnumerable,
                trace_push, trace_pop, kn1, kn2, pn1, pn2;
        // Compare primitives 
        // Check if both arguments link to the same object or function.
        if (o1 === o2)
            return true;

        o1_t = jo.type1(o1);
        //different types means that they are not equal.
        if (o1_t !== jo.type1(o2))
            return false;

        // NaN === NaN returns false
        if (o1_t === 'NaN')
            return true;

        // not object or function
        if (typeof o1 !== 'object' && o1_t !== 'function')
            return false;

        //Especially useful when compare -
        //Date/RegExp/String/Number/Boolean/Function/Array Object
        //Note that 'nullobj' type may not have native 'toString' method,
        //so, we exclude it at first.
        if (o1_t !== 'nullobj' && o1.toString() !== o2.toString())
            return false;

        // keep track of the items visited
        trace_push = function (o1, o2) {
            var index1 = trace1.indexOf(o1), index2 = trace2.indexOf(o2);
            if (index1 !== index2) {
//                console.log(index1, "!==", index2);
                return false;
            }

            if (index1 > -1) {
//                console.log("index1 === index2 ===", index1);
                return true;
            }
            trace1.push(o1);
            trace2.push(o2);
//            console.log("+trace1:", trace1.length, "index1:", index1);
//            console.log("+trace2:", trace2.length, "index2:", index2);
        };
        //pop out the items verified
        trace_pop = function () {
            trace1.pop();
            trace2.pop();
//            console.log("-trace1:", trace1.length);
//            console.log("-trace2:", trace2.length);
        };

        kn1 = Object.keys(o1);
        kn2 = Object.keys(o2);
        if (kn1.length !== kn2.length)
            return false;

        // enumerable properties
        for (i = 0; i < kn1.length; i++) {
            if (kn2.indexOf(kn1[i]) === -1)
                return false;
            else {
                if_return = trace_push(o1[kn1[i]], o2[kn1[i]]);
                if (if_return !== undefined)
                    return if_return;
                if (!sub(o1[kn1[i]], o2[kn1[i]]))
                    return false;
                trace_pop();
            }
        }

        pn1 = Object.getOwnPropertyNames(o1);
        pn2 = Object.getOwnPropertyNames(o2);
        if (pn1.length !== pn2.length)
            return false;

        // non-enumerable properties 
        if (pn1.length !== kn1.length) {
            isEnumerable = Object.prototype.propertyIsEnumerable;
            for (i = 0; i < pn1.length; i++) {
                if (!isEnumerable.call(o1, pn1[i])) {
//                    console.log("non-enumerable: ", pn1[i]); 
                    if (pn2.indexOf(pn1[i]) === -1)
                        return false;
                    if_return = trace_push(o1[pn1[i]], o2[pn1[i]]);
                    if (if_return !== undefined)
                        return if_return;
                    if (!sub(o1[pn1[i]], o2[pn1[i]]))
                        return false;
                    trace_pop();
                }
            }
        }

        // prototypes
        proto1 = jo.getProto(o1);
        proto2 = jo.getProto(o2);

        if_return = trace_push(proto1, proto2);
        if (if_return !== undefined)
            return if_return;
//            console.log("proto: ", proto1, proto2);
        if (!sub(proto1, proto2))
            return false;
        trace_pop();

        return true;
    };
    return sub(o1, o2);
}
var compareContent = joCompare;

// Finished
//from stackoverflow
function deepCompare() {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
                (x instanceof Date && y instanceof Date) ||
                (x instanceof RegExp && y instanceof RegExp) ||
                (x instanceof String && y instanceof String) ||
                (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof (x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
}
// Building
function joRawClone(o) {
    var copy;
    if (typeof o === 'function' || o instanceof RegExp) {
        console.log("eval(*function/RegExp*)" + o.constructor.prototype.toString.call(o));
        copy = eval('(' + o.constructor.prototype.toString.call(o) + ')');
    } else if (Object.prototype.toString.call(o) === '[object Date]' ||
            o instanceof Number) {
        console.log("new Date/Number(+o)");
        copy = new o.constructor(+o);
    }

    return copy;
}

// Building
var joClone = function (obj) {
    var trace1 = [], trace2 = [], bio = [], pn = [];
    var subClone, i, isEnumerable, d, enu;
    isEnumerable = Object.prototype.propertyIsEnumerable;
    // get all the globe objects
    for (i = this; i !== Object.prototype && i; i = getProto(i)) {
        pn = pn.concat(Object.getOwnPropertyNames(i));
        console.info("pn: ", pn.length);
    }
    // get the built-in globe objects.
    for (i = 0; i < pn.length; i++) {
        if ((typeof this[pn[i]] === 'object' ||
                typeof this[pn[i]] === 'function') && this[pn[i]] !== null) {
            d = Object.getOwnPropertyDescriptor(this, pn[i]);
            enu = isEnumerable.call(this, pn[i]); // d.enumerable
            if ((!enu || (enu && !(!d.configurable && d.writable)))) {
                bio.push(pn[i]);
            }
        }
    }
    console.info("bio: ", bio.length);
    subClone = function (obj) {
        var copy, i, pos, pn, d;
        var isDeep = function (o, bio) {
            var i, t;
            var isBiFunc = function (o) {
                var bi_func, s;
                if (typeof o === 'function')
                    s = Function.prototype.toString.call(o);
                else
                    return false;
                bi_func = /^(function)[A-Za-z_$][A-Za-z_$0-9]*(\(\)\{\[nativecode\]\})$/;
                s = s.replace(/\s+/g, ""); // delete spaces
                s = s.replace(/[\r\n]/g, ""); // delete \r\n
                return bi_func.test(s) || o === Function.prototype;
            };
            t = typeof o;
            if (t !== 'object' && t !== 'function')
                return false;
            if (o === null)
                return false;
            if (isBiFunc(o))
                return false;

            for (i = 0; i < bio.length; i++) {
                if (o === this[bio[i]])
                    return false;
                if (typeof this[bio[i]] === 'function' &&
                        o === this[bio[i]].prototype) {
                    return false;
                }

            }

            return true;
        };

        if (!isDeep(obj, bio)) {
            console.log("!isDeep(obj): ");
            //console.log("!isDeep(obj): " + obj);
            return obj;
        }

        pos = trace1.indexOf(obj);
        if (pos > -1) {
            console.log("pos: " + pos);
            return trace2[pos];
        }

        if (typeof obj === 'function' || obj instanceof RegExp) {
            console.log("eval(*function/RegExp*)" + obj.constructor.prototype.toString.call(obj));
            copy = eval('(' + obj.constructor.prototype.toString.call(obj) + ')');
        } else if (Object.prototype.toString.call(obj) === '[object Date]' ||
                obj instanceof Number) {
            console.log("new Date/Number(+obj)");
            copy = new obj.constructor(+obj);
        }
//        else if (obj instanceof RegExp) {
//            d = obj.toString();
//            i = d.lastIndexOf("/");
//            d = i > -1 ? d.slice(i + 1) : "";
//            console.log("new RegExp");
//            copy = new RegExp(obj.source, d);
//            copy = eval('(' + obj.toString() + ')');
//        } 
        else if (obj instanceof String) {
            copy = new obj.constructor(obj.toString());
        }
//        else if (typeof obj.constructor === 'function' &&
//                obj instanceof obj.constructor) {
//            console.log("new obj.constructor()");
//            copy = new obj.constructor();
//        } 
        else {
            console.log("Object.create(null)");
            copy = Object.create(null);
        }

        console.log("******trace.push: " + typeof obj);
        trace1.push(obj);
        trace2.push(copy);

        // clone properties 
        pn = Object.getOwnPropertyNames(obj);
        console.log(">>>>>" + pn.toString());
        for (i = 0; i < pn.length; i++) {
            d = Object.getOwnPropertyDescriptor(obj, pn[i]);
            console.log("hello: " + pn[i]);
            Object.defineProperty(copy, pn[i], {
                enumerable: d.enumerable,
                configurable: d.configurable,
                writable: d.writable,
                value: subClone(obj[pn[i]])
            });
            console.log("hi: " + pn[i]);
        }
        // prototypes
        console.log("setProto(copy, subClone(getProto(obj))) a: " + Object.prototype.toString.call(copy));
        var y = jo.getProto(obj);
        console.log("setProto(copy, subClone(getProto(obj))) b ");
        var x = subClone(y);
        console.log("setProto(copy, subClone(getProto(obj))) c ");
        jo.setProto(copy, x);
        //jo.setProto(copy, subClone(jo.getProto(obj)));

        return copy;
    };

    return subClone(obj);
}.bind(window);





