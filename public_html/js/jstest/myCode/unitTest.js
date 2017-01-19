// return specific data types
function type1(o) {
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
//compare data types
function equalType(o1, o2) {
    return type(o1) === type(o2);
}
function notEqualType(o1, o2) {
    return type(o1) !== type(o2);
}
//check if not equal
function notEqual(o1, o2) {
    return o1 !== o2;
}
//
function Log(index) {
    this.index = (typeof index === 'number' && !isNaN(index)) ? index : 0;
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
        return this.index + ". [" + this.result + "]: " +
                "(...)" + " ==> (" + this.output +
                ") - (" + this.expect + ") expected";
    };
    this.stat = function (html) {
        var total = this.failed + this.passed;
        var rate = total > 0 ? Math.round((this.passed / total) * 100) : 0;
        var str = "Total: " + total + ", Passed: " +
                this.passed + ", Failed: " + this.failed +
                ", Stat: " + rate + "% Passed";
        var p, f, r;
        console.log("----------\n" + str);
        if (html) {
            p = "<span style = 'color:green'>" + this.passed + "</span>";
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
        } else //if (typeof words === "string")
            txt = "<span style = 'color:blue'>" + words + "</span><br>";

        this.text += txt;
    };
}
//
function TestCase(num, html) {
    this.log = new Log(num);
    if (html === undefined)
        this.html = true;
    else
        this.html = html;
}
TestCase.getInstance = function () {
    return new TestCase(0, true);
};
TestCase.prototype.setIndex = function (index) {
    this.log.index = (typeof index === 'number' && !isNaN(index)) ? index : 0;
};
TestCase.prototype.writeLog = function (txt) {
    if (typeof txt)
        this.log.writeLog(txt);
};
TestCase.prototype.setStep = function (step) {
    if (typeof step === "number" && !isNaN(step)) {
        this.log.step = Math.round(step);
        this.log.counter = this.log.step - 1;
        this.log.writeLog("Step is set to " + this.log.step);
    }
};
TestCase.prototype.conclude = function () {
    return this.log.stat(this.html);
};
// only accept one input and one expected result
TestCase.prototype.test$ = function (obj, func, input, expected, cpf) {
    var output, expect, result, compare, e;
    var checkParameter = function (obj, func, input, expected, cpf) {
        var e = new Error("Default");
        e.name = "ParameterError";
        if (!(typeof obj === "object" || typeof obj === "function"))
            e.message = "'obj' should be an object or function";
        if (obj === null)
            e.message = "'obj' is null";
        if (typeof func !== 'string')
            e.message = "'func' - string expected";
        if (input !== undefined && obj[func] && typeof obj[func] !== 'function')
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

    if (!(this.log instanceof Log) ||
            !((typeof this.log.index === 'number') && !isNaN(this.log.index)))
        this.log = new Log(0);
    compare = cpf ? cpf : function (a, b) { // compare primitive values? or Objects?
        return a === b;
    };
    try {
        this.log.addIndex();
        checkParameter(obj, func, input, expected, cpf);
        this.log.func = func;
        this.log.input = input;
        if (input === undefined) // property
            output = obj[func];
        else // method
            output = obj[func].apply(obj, input);
        if ("value" in expected)
            expect = expected.value;
        else if ("type" in expected) {
            output = "`Type: " + type1(output) + "`";
            expect = "`Type: " + expected.type + "`";
        } else if ("error" in expected) {
            e = new Error("No error");
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
    this.log.result = result;
    this.log.output = output;
    this.log.expect = expect;
    if (result === 'PASS')
        this.log.passed++;
    else
        this.log.failed++;
    this.log.writeLog();
    return this.log;
};
//
TestCase.prototype.test1 = function (obj, func, input, expected, cpf) {
    this.test$(obj, func, input, expected, cpf);
    console.log(this.log.current());
    return this.log;
};
//accept mutiple inputs and one expected result
TestCase.prototype.tester = function (obj, func, list, cpf) {
    var i, e;
    try {
        if (!(this.log instanceof Log) ||
                !((typeof this.log.index === 'number') && !isNaN(this.log.index)))
            this.log = new Log(0);

        if (!(list instanceof Array) || !(list[0] instanceof Array)) {
            e = new Error("'input list' - illegal type");
            e.name = "ParameterError";
            throw e;
        } else {
            for (i = 1; i < list.length; i++)
                if (!(list[i] instanceof Array)) {
                    e.message = "'function list' - illegal type";
                    throw e;
                }
        }
        for (i in list) {
            this.test$(obj, func, list[i][0], list[i][1], cpf);
            console.log(this.log.current());
        }
    } catch (err) {
        console.log(this.log.index + ". [" + err.name + "]: " + err.message);
        this.log.writeLog(this.log.index + ". [<span style = 'color:red'>" +
                err.name + "</span>]: " + err.message);
    }
    return this.log;
};
//accept mutiple inputs, mutiple functions  and one expected result
TestCase.prototype.testerX = function (obj, funcs, list, cpf) {
    var i, j, e;
    try {
        if (!(this.log instanceof Log) ||
                !((typeof this.log.index === 'number') && !isNaN(this.log.index)))
            this.log = new Log(0);
        e = new Error("");
        e.name = "ParameterError";
        if (!(funcs instanceof Array) || typeof funcs[0] !== "string") {
            e.message = "'function list' - illegal type";
            throw e;
        }
        if (!(list instanceof Array) || !(list[0] instanceof Array)) {
            e.message = "'input list' - illegal type";
            throw e;
        } else {
            for (i = 1; i < list.length; i++)
                if (!(list[i] instanceof Array)) {
                    e.message = "'function list' - illegal type";
                    throw e;
                }
        }
        for (i in list) {
            for (j in funcs) {
                this.test$(obj, funcs[j], list[i][0], list[i][1], cpf);
                console.log(this.log.current());
            }
        }
    } catch (err) {
        console.log(this.log.index + ". [" + err.name + "]: " + err.message);
        this.log.writeLog(this.log.index + ". [<span style = 'color:red'>" +
                err.name + "</span>]: " + err.message);
    }
    return this.log;
};
// assert two items are equal
TestCase.prototype.assertEqual = function (o1, o2, cpf) {
    var result = (typeof cpf === 'function') ? cpf(o1, o2) : (o1 === o2);
    this.log.addIndex();
    if (result) {
        this.log.passed++;
        this.log.result = 'PASS';
        this.log.output = '`Equal`';
        this.log.expect = '`Equal`';
        console.log(this.log.current());
        this.log.writeLog();
    } else {
        this.log.failed++;
        this.log.result = 'Failed';
        this.log.output = '`Not Equal`';
        this.log.expect = '`Equal`';
        console.log(this.log.current());
        this.log.writeLog();
    }
    return result;
};
// assert two items are not equal
TestCase.prototype.assertNotEqual = function (o1, o2, cpf) {
    var result = (typeof cpf === 'function') ? !cpf(o1, o2) : (o1 !== o2);
    this.log.addIndex();
    if (result) {
        this.log.passed++;
        this.log.result = 'PASS';
        this.log.output = '`Not Equal`';
        this.log.expect = '`Not Equal`';
        console.log(this.log.current());
        this.log.writeLog();
    } else {
        this.log.failed++;
        this.log.result = 'Failed';
        this.log.output = '`Equal`';
        this.log.expect = '`Not Equal`';
        console.log(this.log.current());
        this.log.writeLog();
    }
    return result;
};
TestCase.prototype.assertTrue = function (o, notStrict) {
    var result;
    if (notStrict)
        o = Boolean(o);
    result = (o === true);
    this.log.addIndex();
    if (result) {
        this.log.passed++;
        this.log.result = 'PASS';
        this.log.output = '`True`';
        this.log.expect = '`True`';
        console.log(this.log.current());
        this.log.writeLog();
    } else {
        this.log.failed++;
        this.log.result = 'Failed';
        this.log.output = '`Not True`';
        this.log.expect = '`True`';
        console.log(this.log.current());
        this.log.writeLog();
    }
    return result;
};
TestCase.prototype.assertFalse = function (o, notStrict) {
    var result;
    if (notStrict)
        o = Boolean(o);
    result = (o === false);
    this.log.addIndex();
    if (result) {
        this.log.passed++;
        this.log.result = 'PASS';
        this.log.output = '`False`';
        this.log.expect = '`False`';
        console.log(this.log.current());
        this.log.writeLog();
    } else {
        this.log.failed++;
        this.log.result = 'Failed';
        this.log.output = '`Not False`';
        this.log.expect = '`False`';
        console.log(this.log.current());
        this.log.writeLog();
    }
    return result;
};
TestCase.prototype.startMark = function (num, append) {
    var s = "Test Start - (" + num + ")";
    s += (append === undefined) ? "" : " -- " + append;
    console.log(s);
    this.log.writeLog(s);
};

TestCase.prototype.endMark = function (num, append) {
    var s = "Test End - (" + num + ")";
    s += (append === undefined) ? "" : " -- " + append;
    console.log(s);
    this.log.writeLog(s);
};