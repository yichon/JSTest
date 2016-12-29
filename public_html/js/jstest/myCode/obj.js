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
function compareContent(o1, o2, mode) { // alert("mode:"+mode);
    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (o1 === o2)
        return true;

    // as long as one argument is not object
    if (!(typeof o1 === 'object' && typeof o2 === 'object')) {
        // Works in case when functions are created in constructor.
        // We can even handle functions passed across iframes
        if ((typeof o1 === 'function' && typeof o2 === 'function')) {
            if (o1.toString() !== o2.toString())
                return false;
            else
                return arguments.callee(o1.prototype, o2.prototype, mode);
        }

        // NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (typeof o1 === 'number' && typeof o2 === 'number' && 
                isNaN(o1) && isNaN(o2))
            return true;

        
        // if the program execute to here, it means they are primitive types but not equal.
        // or one is object, the other one is not, different types also return false
        return false;

        // if they're both objescts
    } else {
        // typeof null ==> "object"
        if(o1 === null || o2 === null)
            return false;
        // ...
        if(o1 === Object.prototype || o2 === Object.prototype)
            return false;
        // Comparing dates is a common scenario. Another built-ins?
        if ((o1 instanceof Date && o2 instanceof Date) ||
                (o1 instanceof RegExp && o2 instanceof RegExp) ||
                (o1 instanceof String && o2 instanceof String) ||
                (o1 instanceof Number && o2 instanceof Number) ||
                (o1 instanceof Boolean && o2 instanceof Boolean))
            return o1.toString() === o2.toString();

        // To compare o1.constructor.prototype & o2.constructor.prototype, just set the third parameter 'true'
        if (o1.constructor !== o2.constructor) {
            if (o1.constructor !== null && o2.constructor !== null &&
                    o1.constructor !== undefined && o2.constructor !== undefined) {
                if (o1.constructor.toString() !== o2.constructor.toString()) {
                    return false;
                }
            } else
                return false;
        }

        var attr;
        // simple default mode, only compare the enumerable properties owned by the objects
        if (mode === undefined || !mode) {
            if (Object.keys(o1).length !== Object.keys(o2).length)
                return false;
            for (attr in o1) {
                // Object.create(null) has no such method as 'hasOwnProperty'
                //if(o1[attr] === o1.constructor) alert("constructor");
                if (Object.prototype.hasOwnProperty.call(o1, attr)) {
                    if (!Object.prototype.hasOwnProperty.call(o2, attr))
                        return false;
                    else if (attr !== "constructor" && !arguments.callee(o1[attr], o2[attr], mode))
                        return false;
                }
            }
            return true;

            // If set 'mode' argument 'true', compare all the properties,
            // including enumerable/inenumerable properties,and the properties inherited from parent objects.
            // Tt is a resource-consuming task.
        } else {
            var len1 = 0, len2 = 0;
            for (attr in o1)
                len1++;
            for (attr in o2)
                len2++;
            if (len1 !== len2)
                return false;
            if (Object.keys(o1).length !== Object.keys(o2).length)
                return false;
            if (Object.getOwnPropertyNames(o1).length !== Object.getOwnPropertyNames(o2).length)
                return false;
            
            for (attr in o1) {
                if (!(attr in o2))
                    return false;
                else if (Object.prototype.hasOwnProperty.call(o1, attr) !==
                        Object.prototype.hasOwnProperty.call(o2, attr))
                    return false;
                if (attr !== "constructor" && !arguments.callee(o1[attr], o2[attr], mode))
                    return false;
            }
            //console.log("Hello: ", Object.getOwnPropertyNames(o1).length, Object.keys(o1).length); // 1  0
            if (Object.getOwnPropertyNames(o1).length !== Object.keys(o1).length) {//console.log("Hello!");
                var pnames = Object.getOwnPropertyNames(o1);
                var knames = Object.keys(o1);
                var k = true;
                for (var i = 0; i < pnames.length; i++) {
                    for (var j = 0; j < knames.length; j++) {
                        if (pnames[i] === knames[j]) {
                            k = false;
                            break;
                        }
                    }
                    //console.log("Hello: ", pnames[i]);
                    if (pnames[i] !== "constructor" && k && 
                            !arguments.callee(o1[pnames[i]], o2[pnames[i]], mode))
                        return false;
                    k = true;
                }
            }
            return true;
        }

    }

}

// Building
function compareObj(o1, o2) {
    return compareOwn(o1, o2);
}
function compareOwn(o1, o2) {
    if (o1 === o2)
        return true;
    if (!(typeof o1 === 'object' && typeof o2 === 'object')) {
        if ((typeof o1 === 'function' && typeof o2 === 'function')) {
            return o1.toString() === o2.toString();
        }
        if (isNaN(o1) && isNaN(o2) && typeof o1 === 'number' && typeof o2 === 'number')
            return true;
        return false;
    } else {
        if ((o1 instanceof Date && o2 instanceof Date) ||
                (o1 instanceof RegExp && o2 instanceof RegExp) ||
                (o1 instanceof String && o2 instanceof String) ||
                (o1 instanceof Number && o2 instanceof Number) ||
                (o1 instanceof Boolean && o2 instanceof Boolean))
            return o1.toString() === o2.toString();
        if ((o1 instanceof Array !== o2 instanceof Array) ||
                (o1 instanceof String !== o2 instanceof String) ||
                (o1 instanceof Number !== o2 instanceof Number) ||
                (o1 instanceof RegExp !== o2 instanceof RegExp) ||
                (o1 instanceof Boolean !== o2 instanceof Boolean) ||
                (o1 instanceof Date !== o2 instanceof Date))
            return false;
        var attr;
        if (Object.keys(o1).length !== Object.keys(o2).length)
            return false;
        for (attr in o1) {
            if (Object.prototype.hasOwnProperty.call(o1, attr)) {
                if (!Object.prototype.hasOwnProperty.call(o2, attr))
                    return false;
                else if (!arguments.callee(o1[attr], o2[attr]))
                    return false;
            }
        }
        return true;
    }
}

// Building
function simpleCompare(o1, o2) {
    // Works when compare simple JSON-style objects without methods and DOM nodes inside
    // Include RegExp
    // If their ORDERs of the properties are not the same, it will return false.
    // Fast and limited
    return JSON.stringify(o1) === JSON.stringify(o2);
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