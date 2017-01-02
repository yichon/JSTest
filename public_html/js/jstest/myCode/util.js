function Counter(num) {
    this.times = (typeof num === 'number' && !isNaN(num)) ? num : 0;
    this.add = function () {
        this.times++;
    };
    this.deduct = function () {
        this.times--;
    };
}
Counter.prototype.toString = function () {
    return this.times;
};
function type(o) {
    var to = typeof o;
    if (o === null)
        return "null";
    if (o instanceof Array)
        return "array";
    if (to === "number" && isNaN(o))
        return "NaN";
    try {
        if(to === "object")
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
function grab(id) {
    return document.getElementById(id);
}
//
function S() {

}
S.grab = grab;

