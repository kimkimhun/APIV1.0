exports.messagecomming = (payload) => {
    var value;
    var sum = 0;
    var arr = payload.toString().split("/").map((val)=> {
        return Number(val);
    });
    for (var i = 0; i < arr.length - 1; i++) {
        sum += arr[i];
    }
    if (sum == arr[arr.length-1]) {
        value = {
            "temperasure": arr[1],
            "humidity": arr[2],
            "hour": arr[3],
            "day": arr[4],
            "connected": arr[5]
        };
        return value;
    }
    else {
        return {lost: 0};
    }

}

exports.messagecommingSet = (payload) => {
    var value;
    var sum = 0;
    var arr = payload.toString().split("/").map((val)=> {
        return Number(val);
    });
    for (var i = 0; i < arr.length - 1; i++) {
        sum += arr[i];
    }
    if (sum == arr[arr.length-1]) {
        value = {
            "temperasure": arr[1],
            "humidity": arr[2],
            "hour": arr[3]
        };
        return value;
    }
    else {
        return {lost: 0};
    }

}


exports.messageemit = (payload) => {

    var sum = 0;
    var arr = payload.toString().split("/").map((val)=> {
        return Number(val);
    });
    for (var i = 0; i < arr.length - 1; i++) {
        sum += arr[i];
    }
    if (sum == arr[arr.length-1]) {
        return payload;
    }
    else {
        return {lost: 0};
    }

}