function packForm(form) {
    if ((typeof form) !== 'object')
        return '';
    var attr, arr = [];
    for (attr in form) {
        arr.push(attr + "=" + form[attr]);
    }
    return arr.join('&');
}
function httpGet(url, form, callback, async) {
    var xhttp = new XMLHttpRequest();
    var f = packForm(form);
    if (f !== '')
        url += '?' + f;
    if (async === undefined || async) {
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200)
                callback(xhttp.responseText, form, url);
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    } else {
        //alert("Hello!");
        xhttp.open('GET', url, false);
        xhttp.send();
        callback(xhttp.responseText, form, url);
    }
}
function httpPost(url, form, callback, async) {
    var xhttp = new XMLHttpRequest();
    var f = packForm(form);
    if (async === undefined || async) {
        xhttp.onreadystatechange = function () { // alert("Hello!"+xhttp.readyState+" - "+xhttp.status);
            if (xhttp.readyState === 4 && xhttp.status === 200)
                {callback(xhttp.responseText, form, url);}
        };
        xhttp.open('POST', url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(f);
    } else {
        //alert("Hello!");
        xhttp.open('POST', url, false);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(f);
        callback(xhttp.responseText, form, url);
    }
}
function httpX(method, url, form, callback, async) {
    if (method === 'GET')
        httpGet(url, form, callback, async);
    if (method === 'POST')
        httpPost(url, form, callback, async);
}