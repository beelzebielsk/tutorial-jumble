function createLimitedArray(limit) {
    let arr = [];
    arr.limit = limit;
    arr.add = function(element) {
        arr.push(element);
        if (arr.length > arr.limit) arr.shift();
    };
    return arr;
}
