function fileReader(url) {
    //
    var reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    var obj ={
        status:0,
        data:{}
    };
    if (reg.test(url)) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200){
                obj.status = 1;
                obj.data = JSON.parse(xhttp.responseText);
                return obj;
            }
                
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    }
    else return obj;

}


