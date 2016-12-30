function Type(o){
    if(o === null)
        return "null";
    if(o instanceof Array)
        return "array";
    if(typeof o === "number" && isNaN(o))
        return "NaN";
    return typeof o;
}
function compareType(o1, o2){
    return Type(o1) ===  Type(o2);
}

function Log(index) {
    this.index = (typeof index === 'number' && !isNaN(index)) ? index : 0;
    this.result = undefined;
    this.output = undefined;
    this.expect = undefined;
    this.failed = 0;
    this.passed = 0;
    this.current = function () {
        console.log(this.index + ".", "[" + this.result + "]:", "Output:",
                this.output, ";", "Expected: " + this.expect);
    };
    this.stat = function () {
        let total = this.failed + this.passed;
        let rate = total > 0 ? ((this.passed / total) * 100) : 0;
        console.log("Total: " + total + ",",
                "Failed: " + this.failed + ",",
                "Passed: " + this.passed + ",",
                "Stat: " + rate + "% Passed");
    };
}
// only accept one input and one expected result
function testO(obj, func, input, expected, log, cpf) {
    if (!(log instanceof Log) ||
            !((typeof log.index === 'number') && !isNaN(log.index)))
        log = new Log(0);
    var compare = cpf ? cpf : function (a, b) { // compare primitive values? or Objects?
        return a === b;
    };
    var output, expect, result;
    var checkParameter = function (obj, func, input, expected, log, cpf) {
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
                !("value" in expected || "type" in expected || "error" in expected))
            e.message = "'expected' - illegal type";
        if (e.message !== "Default")
            throw e;
    };
    try {
        log.index++;
        checkParameter(obj, func, input, expected, log, cpf);
        if (input === undefined) // property
            output = obj[func];
        else // method
            output = obj[func].apply(obj, input);
        if ("value" in expected)
            expect = expected.value;
        else if ("type" in expected) {
            if (output instanceof Array)
                output = 'array';
            else
                output = typeof output;
            expect = expected.type;
        } else if ("error" in expected) {
            let e = new Error("No error occured");
            e.name = "Failed";
            throw e;
        } else
            throw "Unkown Error";
        result = compare(output, expect) ? 'PASS' : 'Failed';
    } catch (err) {
        if ("error" in expected) {
            output = err.message;
            expect = expected.error;
            result = compare(output, expect) ? 'PASS' : 'Failed';
        } else {
            output = "[" + err.name + "]: " + err.message;
            expect = ("value" in expected) ? expected.value :
                    (("type" in expected) ? expected.type : "void");
            result = 'Failed';
        }
    }
    log.result = result;
    log.output = output;
    log.expect = expect;
    if (result === 'PASS')
        log.passed++;
    else
        log.failed++;
    return log;
}
function test1(obj, func, input, expected, log, cpf) {
    let lg = testO(obj, func, input, expected, log, cpf);
    lg.current();
    return lg;
}
//accept mutiple inputs and one expected result
function testM(obj, func, inputlist, expected, log, cpf) {
    try {
        if (!(log instanceof Log) ||
                !((typeof log.index === 'number') && !isNaN(log.index)))
            log = new Log(0);

        if (!(inputlist instanceof Array) || !(inputlist[0] instanceof Array)) {
            var e = new Error("'inputlist' - illegal type");
            e.name = "ParameterError";
            throw e;
        }
        for (let i in inputlist) {
            log = testO(obj, func, inputlist[i], expected, log, cpf);
            log.current();
        }
    } catch (err) {
        console.log(0 + ".", "[*" + err.name + "]:", err.message);
    }
    return log;
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