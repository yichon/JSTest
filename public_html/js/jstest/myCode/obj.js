function type(o) {
    var to = typeof o;
    if (o === null)
        return "null";
    if (o instanceof Array)
        return "array";
    if (to === "number" && isNaN(o))
        return "NaN";
    try {
        if (to === "object")
            isNaN(o); //Object.create(null) & its descendants will throw an error         
    } catch (err) {
        return "nullobj";
    }
    return to;
}
//
function compareType(o1, o2) {
    return type(o1) === type(o2);
}
// Finished
function isEmptyObj(e) {
    var t;
    for (t in e)
        return false;
    return true;
}

// Finished
function outputObj(o, decodeUrl) {
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

// Building
// Object.is() ?
function compareObj(o1, o2, mode) {
    var trace1 = [], trace2 = [];
    var sub = function (o1, o2, mode) {
        var o1_t, ifpush, attr, proto1, proto2,
                trace_push, trace_pop, traverse1, traverse2,
                len1, len2, knames1, knames2, pnames1;
        // Compare primitives 
        // Check if both arguments link to the same object or function.
        // Especially useful on the step where we compare prototypes
        if (o1 === o2)
            return true;

        o1_t = type(o1);
        //different types means that they are not equal.
        if (o1_t !== type(o2))
            return false;

        // NaN === NaN returns false
        if (o1_t === 'NaN')
            return true;

        // not object or function
        if (typeof o1 !== 'object' && o1_t !== 'function')
            return false;

        // Comparing dates is a common scenario. Another built-ins?
        if ((o1 instanceof Date && o2 instanceof Date) ||
                (o1 instanceof RegExp && o2 instanceof RegExp) ||
                (o1 instanceof String && o2 instanceof String) ||
                (o1 instanceof Number && o2 instanceof Number) ||
                (o1 instanceof Boolean && o2 instanceof Boolean))
            return o1.toString() === o2.toString();

        // ...
        if (o1_t === 'function') {
            if (o1.toString() !== o2.toString())
                return false;
        }
        //
        trace_push = function (o1, o2) {
            var index1 = trace1.indexOf(o1), index2 = trace2.indexOf(o2);
            if (index1 !== index2)
                return false;
            if (index1 > -1) {
                console.log("index1 === index2 ===", index1);
                return true;
            }
            trace1.push(o1);
            trace2.push(o2);
            console.log("+trace1:", trace1.length, "index1:", index1);
            console.log("+trace2:", trace2.length, "index2:", index2);
        };
        // 
        trace_pop = function () {
            trace1.pop();
            trace2.pop();
            console.log("-trace1:", trace1.length);
            console.log("-trace2:", trace2.length);
        };
        // enumerable properties
        traverse2 = function () {
            var ifpush;
            var hasOwn = Object.prototype.hasOwnProperty;
            for (attr in o1) {
                // Object.create(null) has no such method as 'hasOwnProperty'
                if (hasOwn.call(o1, attr)) {
                    if (!hasOwn.call(o2, attr))
                        return false;
                    else {
                        ifpush = trace_push(o1[attr], o2[attr]);
                        if (ifpush !== undefined)
                            return ifpush;
                        if (!sub(o1[attr], o2[attr], mode))
                            return false;
                        trace_pop();
                    }
                }
            }
            return true;
        };
        // simple default mode, only compare the enumerable properties owned by the objects
        knames1 = Object.keys(o1);
        knames2 = Object.keys(o2);
        if (knames1.length !== knames2.length)
            return false;

        len1 = 0, len2 = 0;
        for (attr in o1)
            len1++;
        for (attr in o2)
            len2++;
        if (len1 !== len2)
            return false;

        pnames1 = Object.getOwnPropertyNames(o1);
        if (pnames1.length !== Object.getOwnPropertyNames(o2).length)
            return false;

        if (!traverse2())
            return false;

        if (pnames1.length !== knames1.length) {
            var ok = true;
            for (var i = 0; i < pnames1.length; i++) {
                for (var j = 0; j < knames1.length; j++) {
                    if (pnames1[i] === knames1[j]) {
                        ok = false;
                        break;
                    }
                }
                if (ok) {
                    ifpush = trace_push(o1[pnames1[i]], o2[pnames1[i]]);
                    if (ifpush !== undefined)
                        return ifpush;
                    if (!sub(o1[pnames1[i]], o2[pnames1[i]], mode))
                        return false;
                    trace_pop();
                }
                ok = true;
            }
        }

        if (typeof Object.getPrototypeOf === 'function' || 
                (typeof o1.__proto__ === 'object' && typeof o2.__proto__ === 'object') ||
                (typeof o1.constructor === 'function' && typeof o1.constructor === 'function')) {
            if (typeof Object.getPrototypeOf === 'function') {
                proto1 = Object.getPrototypeOf(o1);
                proto2 = Object.getPrototypeOf(o2);
            } else if((typeof o1.__proto__ === 'object' && typeof o2.__proto__ === 'object')){
                proto1 = o1.__proto__;
                proto2 = o2.__proto__;
            }else{
                proto1 = o1.constructor.prototype;
                proto2 = o2.constructor.prototype;
            }
            ifpush = trace_push(proto1, proto2);
            if (ifpush !== undefined)
                return ifpush;
            console.log(proto1, proto2);
            if (!sub(proto1, proto2, mode))
                return false;
            trace_pop();
        }

        return true;
    };
    return sub(o1, o2, mode);
}

// Building
function compareContent(o1, o2, mode) {
    return compareObj(o1, o2, mode);
}
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
function cloneObj(obj) {
    var copy = {};
    //

    return copy;
}