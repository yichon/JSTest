var otod = function (num) {
    var sub = function (num, b, tb) {
        if (b < 2 || tb < 2)
            return 0;
        var x = 0, ct = 0, n = num;
        while (n > 7) {
            x += (n % b) * Math.pow(tb, ct);
            n = Math.floor(n / b);
            ct++;
        }
        x += n * Math.pow(tb, ct);
        return x;
    };
    return sub(num, 8, 10);
};

traverse1 = function (o1, o2, mode) {
    var attr, ifpush;
    for (attr in o1) {
        // Object.create(null) has no such method as 'hasOwnProperty'
        if (!(attr in o2))
            return false;
        else if (Object.prototype.hasOwnProperty.call(o1, attr) !==
                Object.prototype.hasOwnProperty.call(o2, attr))
            return false;
        ifpush = trace_push(o1[attr], o2[attr]);
        if (ifpush !== undefined)
            return ifpush;
        if (!sub(o1[attr], o2[attr], mode))
            return false;
        trace_pop();
    }
    return true;
};

traverse2 = function (o1, o2, mode) {
    var attr, ifpush;
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


//if (mode === undefined || !mode) {
//            if (!traverse2())
//                return false;
//            // If set 'mode' argument 'true', compare all the properties,
//            // including enumerable/inenumerable properties,and the properties inherited from parent objects.
//            // Tt is a resource-consuming task.
//        } else {}

//        len1 = 0, len2 = 0;
//        for (attr in o1)
//            len1++;
//        for (attr in o2)
//            len2++;
//        if (len1 !== len2)
//            return false;


//        if (pn1.length !== kn1.length) {
//            ok = true;
//            for (i = 0; i < pn1.length; i++) {
//                for (j = 0; j < kn1.length; j++) {
//                    if (pn1[i] === kn1[j]) {
//                        ok = false;
//                        break;
//                    }
//                }
//                if (ok) {
////                    console.log("non-enumerable: ", pn1[i]); //
//                    if (pn2.indexOf(pn1[i]) === -1)
//                        return false;
//                    ifpush = trace_push(o1[pn1[i]], o2[pn1[i]]);
//                    if (ifpush !== undefined)
//                        return ifpush;
//                    if (!sub(o1[pn1[i]], o2[pn1[i]]))
//                        return false;
//                    trace_pop();
//                }
//                ok = true;
//            }
//        }

//
//        // Comparing dates is a common scenario. 
//        if ((o1 instanceof Date && o2 instanceof Date) ||
//                (o1 instanceof RegExp && o2 instanceof RegExp) ||
//                (o1 instanceof String && o2 instanceof String) ||
//                (o1 instanceof Number && o2 instanceof Number) ||
//                (o1 instanceof Boolean && o2 instanceof Boolean))
//            return o1.toString() === o2.toString();
//
//        // ...
//        if (o1_t === 'function') {
//            if (o1.toString() !== o2.toString())
//                return false;
//        }