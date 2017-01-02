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
//
function Log(index) {
    this.index = (typeof num === 'number' && !isNaN(index)) ? index : 0;
    this.step = 1;
    this.counter = 0;
    this.func = "";
    this.input = "";
    this.result = undefined;
    this.output = undefined;
    this.expect = undefined;
    this.failed = 0;
    this.passed = 0;
    this.text = "";
    this.addIndex = function () {
        this.counter++;
        if (this.counter === this.step) {
            this.index++;
            this.counter = 0;
        }
    };
    this.current = function () {
        return this.index + ". [" + this.result + "]: "+ 
                "(...)" + " ==> (" + this.output + 
                ") - (" + this.expect + ") expected";
    };
    this.stat = function (html) {
        let total = this.failed + this.passed;
        let rate = total > 0 ? Math.round((this.passed / total) * 100) : 0;
        let str = "Total: " + total + ", Passed: " +
                this.passed + ", Failed: " + this.failed +
                ", Stat: " + rate + "% Passed";
        console.log("----------\n" + str);
        if (html) {
            let p = "<span style = 'color:green'>" + this.passed + "</span>";
            let f, r;
            if (this.failed === 0) {
                f = "<span style = 'color:green'>" + this.failed + "</span>";
                r = "<span style = 'color:green'>" + rate + "</span>";
            } else {
                f = "<span style = 'color:red'>" + this.failed + "</span>";
                r = "<span style = 'color:red'>" + rate + "</span>";
            }
            return this.text + "----------<br>" +
                    "Total: " + total + ", Passed: " + p +
                    ", Failed: " + f + ", Stat: " + r + "% Passed";
        } else
            return str;
    };
    this.writeLog = function (words) {
        var r, txt;
        if (words === undefined) {
            if (this.result === 'PASS')
                r = "<span style = 'color:green'>" + this.result + "</span>";
            else
                r = "<span style = 'color:red'>" + this.result + "</span>";
            txt = this.index + ". [" + r + "]: (...) ==> (" +
                    this.output + ") - (" + this.expect + ") expected<br>";
        } else if (typeof words === "string")
            txt = words + "<br>";

        this.text += txt;
    };
}
// only accept one input and one expected result
function test$(obj, func, input, expected, log, cpf) {
    var output, expect, result, compare;
    var checkParameter = function (obj, func, input, expected, log, cpf) {
        var e = new Error("Default");       
        e.name = "ParameterError";
        if (!(typeof obj === "object" || typeof obj === "function"))
            e.message = "'obj' should be an object or function";
        if (obj === null)
            e.message = "'obj' is null";
        if (typeof func !== 'string') 
            e.message = "'func' - string expected";
        if (obj[func] && typeof obj[func] !== 'function')
            e.message = "'obj[func]' - undefined or illegal type";
        if (!obj[func] && input)
            e.message = "method - not exist";
        if (!(input instanceof Array || input === null || input === undefined))
            e.message = "'input' - illegal type";
        if (typeof expected === 'string')
            expected = {value: expected};
        if (!expected || typeof expected !== 'object' ||
                !("value" in expected || "type" in expected || "error" in expected))
            e.message = "'expected' - illegal type";
        if (e.message !== "Default")
            throw e;
    };
    
    if (!(log instanceof Log) ||
            !((typeof log.index === 'number') && !isNaN(log.index)))
        log = new Log(0);
    compare = cpf ? cpf : function (a, b) { // compare primitive values? or Objects?
        return a === b;
    };
    try {
        log.addIndex();
        checkParameter(obj, func, input, expected, log, cpf);
        log.func = func;
        log.input = input;
        if (input === undefined) // property
            output = obj[func];
        else // method
            output = obj[func].apply(obj, input);
        if ("value" in expected)
            expect = expected.value;
        else if ("type" in expected) {
            output = "`Type: " + type(output) + "`";
            expect = "`Type: " + expected.type + "`";
        } else if ("error" in expected) {
            let e = new Error("No error occured");
            e.name = "Failed";
            throw e;
        } else
            throw "Unkown Error";
        result = compare(output, expect) ? 'PASS' : 'Failed';
    } catch (err) {
        if ("error" in expected) {
            output = "[Error:" + err.message + "]";
            expect = "[Error:" + expected.error + "]";
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
    log.writeLog();
    return log;
}
function test1(obj, func, input, expected, log, cpf) {
    let lg = test$(obj, func, input, expected, log, cpf);
    console.log(lg.current());
    return lg;
}
//accept mutiple inputs and one expected result
function tester(obj, func, list, log, cpf) {
    try {
        if (!(log instanceof Log) ||
                !((typeof log.index === 'number') && !isNaN(log.index)))
            log = new Log(0);

        if (!(list instanceof Array) || !(list[0] instanceof Array)) {
            var e = new Error("'input list' - illegal type");
            e.name = "ParameterError";
            throw e;
        } else {
            for (let i = 1; i < list.length; i++)
                if (!(list[i] instanceof Array)) {
                    e.message = "'function list' - illegal type";
                    throw e;
                }
        }
        for (let i in list) {
            log = test$(obj, func, list[i][0], list[i][1], log, cpf);
            console.log(log.current());
        }
    } catch (err) {
        console.log(log.index + ". [" + err.name + "]: " + err.message);
        log.writeLog(log.index + ". [<span style = 'color:red'>" +
                err.name + "</span>]: " + err.message);
    }
    return log;
}
//
function testerX(obj, funcs, list, log, cpf) {
    try {
        if (!(log instanceof Log) ||
                !((typeof log.index === 'number') && !isNaN(log.index)))
            log = new Log(0);
        var e = new Error("");
        e.name = "ParameterError";
        if (!(funcs instanceof Array) || typeof funcs[0] !== "string") {
            e.message = "'function list' - illegal type";
            throw e;
        }
        if (!(list instanceof Array) || !(list[0] instanceof Array)) {
            e.message = "'input list' - illegal type";
            throw e;
        } else {
            for (let i = 1; i < list.length; i++)
                if (!(list[i] instanceof Array)) {
                    e.message = "'function list' - illegal type";
                    throw e;
                }
        }
        for (let j in funcs) {
            for (let i in list) {
                log = test$(obj, funcs[j], list[i][0], list[i][1], log, cpf);
                console.log(log.current());
            }
        }
    } catch (err) {
        console.log(log.index + ". [" + err.name + "]: " + err.message);
        log.writeLog(log.index + ". [<span style = 'color:red'>" +
                err.name + "</span>]: " + err.message);
    }
    return log;
}
//
function TestCase(num, html) {
    this.log = new Log(num);
    this.html = html;
}
TestCase.prototype.setStep = function (step) {
    if (typeof step === "number" && !isNaN(step)) {
        this.log.step = Math.round(step);
        this.log.counter = this.log.step - 1;
        this.log.writeLog("Step is set to " + this.log.step);
    }
};
TestCase.prototype.test$ = function (obj, func, input, expected, cpf) {
    test$(obj, func, input, expected, this.log, cpf);
};
TestCase.prototype.test1 = function (obj, func, input, expected, cpf) {
    test1(obj, func, input, expected, this.log, cpf);
};
TestCase.prototype.tester = function (obj, func, list, cpf) {
    tester(obj, func, list, this.log, cpf);
};
TestCase.prototype.testerX = function (obj, funcs, list, cpf) {
    testerX(obj, funcs, list, this.log, cpf);
};
TestCase.prototype.conclude = function () {
    return this.log.stat(this.html);
};
