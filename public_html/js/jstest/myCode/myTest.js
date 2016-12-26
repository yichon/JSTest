function compareObjContent(obj1, obj2) {
    //
    var sub = function (o1, o2) {

        if (typeof o1 !== 'object' && typeof o2 !== 'object' && o1 === o2)
            return true;
        else if (typeof o1 === 'object' && typeof o2 === 'object') {
            var attr;
            for (attr in o1) {
                if (typeof o1[attr] === 'object' && o2[attr]) {
                    if (!arguments.callee(o1[attr], o2[attr]))
                        return false;
                } else if (o2[attr] && o1[attr] !== o2[attr])
                    return false;
            }
            return true;
        } else
            return false;

    };
    return sub(obj1, obj2);
}

function autoTest(unit, schema) {
    if (typeof unit !== 'function')
        return false;

    if (typeof schema !== 'object')
        return false;

    if (unit.apply(schema.input) === schema.output)
        return true;
    else
        return false;

}