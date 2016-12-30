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

