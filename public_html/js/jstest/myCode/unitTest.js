// only accept one input and one expected result
function test1(obj, func, input, expected, counter, cpf) {
    try {
        var ct = (typeof counter === 'number' && !isNaN(counter)) ? counter : 1;
        if (!(typeof obj === "object" || typeof obj === "function"))
            throw "[*Parameter Error]: 'obj' should be an object or function";
        if (obj === null)
            throw "[*Parameter Error]: 'obj' is null";
        if (typeof func !== 'string')
            throw "[*Parameter Error]: 'func' - not a string";
        if (typeof obj[func] !== 'function')
            throw "[*Parameter Error]: 'obj[func]' - undefined or illegal type";
        if (!(input instanceof Array || input === null || input === undefined))
            throw "[*Parameter Error]: 'input' - illegal type";
        if ((typeof counter !== 'number') || isNaN(counter))
            throw "[*Parameter Error]: 'counter' - not a number";

//        if (!(typeof obj === "object" || typeof obj === "function") ||
//                obj === null || (typeof func !== 'string') ||
//                typeof obj[func] !== 'function' ||
//                !(input instanceof Array || input === null || input === undefined) ||
//                (typeof counter !== 'number') || isNaN(counter)) {
//            throw "[*Parameter Error]";
//        }

        let compare = cpf ? cpf : function (a, b) { // compare primitive values? or Objects?
            return a === b;
        };
        let output, result;
        if (input === undefined) // property
            output = obj[func];
        else // method
            output = obj[func].apply(obj, input);
        result = compare(output, expected) ? 'Success' : '*Failed';
        console.log((ct++) + ".", "[" + result + "]:", "Output:",
                output, ";", "Expected: " + expected);

    } catch (err) {
        console.log((ct++) + ".", err);
    }
    return ct;
}
//
function test1x(list, counter, cpf) {
    try {
        if (!(list instanceof Array) || list.length === 0 ||
                (typeof counter !== 'number') || isNaN(counter)) {
            throw "[*Parameter Error]";
        }
        for (let i in list) {
            let x = list[i];
            counter = test1(x.obj, x.func, x.input, x.expected, counter, cpf);
        }

    } catch (err) {
        console.log(0 + ".", err);
    }
}
//accept mutiple inputs and one expected result
function testMI(obj, func, inputlist, expected, counter, cpf) {
    try {
        var ct = (typeof counter === 'number' && !isNaN(counter)) ? counter : 1;
        if (!(typeof obj === "object" || typeof obj === "function"))
            throw "[*Parameter Error]: 'obj' should be an object or function";
        if (obj === null)
            throw "[*Parameter Error]: 'obj' is null";
        if (typeof func !== 'string')
            throw "[*Parameter Error]: 'func' is not string";
        if (typeof obj[func] !== 'function')
            throw "[*Parameter Error]: obj[func] - undefined or illegal type";
        if (!(inputlist instanceof Array) || !(inputlist[0] instanceof Array))
            throw "[*Parameter Error]: inputlist - illegal type";
        if ((typeof counter !== 'number') || isNaN(counter))
            throw "[*Parameter Error]: 'counter' - not a number";
//        if (!(typeof obj === "object" || typeof obj === "function") ||
//                obj === null || (typeof func !== 'string') ||
//                typeof obj[func] !== 'function' || !(inputlist instanceof Array) ||
//                !(inputlist[0] instanceof Array) ||
//                (typeof counter !== 'number') || isNaN(counter)) {
//            throw "[*Parameter Error]";
//        }
        let compare = cpf ? cpf : function (a, b) {
            return a === b;
        };
        let output;
        let result = '*Failed';
        for (let i in inputlist) {
            output = obj[func].apply(obj, inputlist[i]);
            result = compare(output, expected) ? 'Success' : '*Failed';
            console.log((ct++) + ".", "[" + result + "]:", "Output:", output, ";", "Expected: " + expected);
        }
    } catch (err) {
        console.log(0 + ".", err);
    }
    return ct;
}
//
function testMIx(func, inputlist, expected, counter, cpf) {
    try {
        if (!(func instanceof Array) || func.length === 0 ||
                (typeof counter !== 'number') || isNaN(counter)) {
            throw "[*Parameter Error]";
        }
        for (let i in func) {
            let x = func[i];
            counter = testMI(x.obj, x.func, inputlist, expected, counter, cpf);
        }
    } catch (err) {
        console.log(0 + "x.", err);
    }
}


function compareObjContent(obj1, obj2) {
    //
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