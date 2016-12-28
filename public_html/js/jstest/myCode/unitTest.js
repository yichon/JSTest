// only accept one input and one expected result
function test1(obj, func, input, expected, counter, cpf) {
    try {
        var ct = (typeof counter === 'number' && !isNaN(counter)) ? counter : 1;
        let checkParameter = function (obj, func, input, expected, counter, cpf) {
            var e = new Error("Default");
            e.name = "ParameterError";
            if (!(typeof obj === "object" || typeof obj === "function"))
                e.message = "'obj' should be an object or function";
            if (obj === null)
                e.message = "'obj' is null";
            if (typeof func !== 'string')
                e.message = "'func' - not a string";
            if (obj[func] && typeof obj[func] !== 'function')
                e.message = "'obj[func]' - undefined or illegal type";
            if (!obj[func] && input)
                e.message = "method - not exist";
            if (!(input instanceof Array || input === null || input === undefined))
                e.message = "'input' - illegal type";
            if (!expected || typeof expected !== 'object' ||
                    !("value" in expected || expected.type || expected.error))
                e.message = "'expected' - illegal type";
            if ((typeof counter !== 'number') || isNaN(counter))
                e.message = "'counter' - not a number";
            if (e.message !== "Default")
                throw e;
        };
        checkParameter(obj, func, input, expected, counter, cpf);
        let compare = cpf ? cpf : function (a, b) { // compare primitive values? or Objects?
            return a === b;
        };
        let output, expect, result;
        if (input === undefined) // property
            output = obj[func];
        else // method
            output = obj[func].apply(obj, input);
        if ("value" in expected)
            expect = expected.value;
        else if (expected.type){
            output = typeof output;
            expect = expected.type;
        }else{
            
        }
        result = compare(output, expect) ? 'Success' : '*Failed';
        console.log((ct++) + ".", "[" + result + "]:", "Output:",
                output, ";", "Expected: " + expect);
    } catch (err) {
        if (expected.error && expected.error === err.message)
            console.log((ct++) + ".", "[Success]:", "Output:",
                    err.message, ";", "Expected: " + expected.error);
        else
            console.log((ct++) + ".", "[*" + err.name + "]:", err.message);
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
        let checkParameter = function (obj, func, inputlist, expected, counter, cpf) {
            var e = new Error("Default");
            e.name = "ParameterError";
            if (!(typeof obj === "object" || typeof obj === "function"))
                e.message = "'obj' should be an object or function";
            if (obj === null)
                e.message = "'obj' is null";
            if (typeof func !== 'string')
                e.message = "'func' - not a string";
            if (typeof obj[func] !== 'function')
                e.message = "'obj[func]' - undefined or illegal type";
            if (!(inputlist instanceof Array) || !(inputlist[0] instanceof Array))
                e.message = "'input' - illegal type";
            if ((typeof counter !== 'number') || isNaN(counter))
                e.message = "'counter' - not a number";
            if (e.message !== "Default")
                throw e;
        };
        checkParameter(obj, func, inputlist, expected, counter, cpf);
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
        if (expected && typeof expected === 'object'
                && expected.error && expected.error === err.message)
            console.log((ct++) + ".", "[Success]:", "Output:",
                    err.message, ";", "Expected: " + expected.error);
        else
            console.log(0 + ".", "[*" + err.name + "]:", err.message);
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