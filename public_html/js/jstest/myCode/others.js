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