function getReg(type) {
    switch (type) {
        case "url":
            return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        case "email":
            ;


        default:
            ;
    }

}

var built_in_func0 = /^(\n)?(function )[A-Za-z_$][A-Za-z_$0-9]*(\(\) \{)(\n)?(    \[native code\])(\n)?(\})(\n)?$/;  // g? 
var built_in_func = /^(function)[A-Za-z][A-Za-z_$0-9]*(\(\)\{\[nativecode\]\})$/;  // g? 

var isBiFunc = function (o) {
    var bi_func, s;
    if (typeof o === 'function')
        s = Function.prototype.toString.call(o);
    else
        return false;
    bi_func = /^(function)[A-Za-z_$][A-Za-z_$0-9]*(\(\)\{\[nativecode\]\})$/;
    s = s.replace(/\s+/g, ""); // delete spaces
    s = s.replace(/[\r\n]/g, ""); // delete \r\n
    return bi_func.test(s) || o === Function.prototype;
};

//去除空格 
var Trim = function () {
    return this.replace(/\s+/g, "");
};

//去除换行 
function ClearBr(key) {
    key = key.replace(/<\/?.+?>/g, "");
    key = key.replace(/[\r\n]/g, "");
    return key;
}

//去除左侧空格 
function LTrim(str) {
    return str.replace(/^\s*/g, "");
}

//去右空格 
function RTrim(str) {
    return str.replace(/\s*$/g, "");
}

//去掉字符串两端的空格 
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

//去除字符串中间空格 
function CTim(str) {
    return str.replace(/\s/g, '');
}

//是否为由数字组成的字符串 
function is_digitals(str) {
    var reg = /^[0-9]*$/; //匹配整数 
    return reg.test(str);
}