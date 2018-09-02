#lang pollen

◊code[#:language "javascript"]{
    ◊name{Basic Array Search}
    ◊description{This function returns true if the argument `value` is
    present in the array. It returns false if the value is not in the
    array.}
function arraySearch(array, value) {
    for (int i = 0; i < array.length; i++) {
        if (value === array[i]) return true;
    }
    return false;
}
}

For all listings that use numbers represented as lists of bits, the
0th bit is the least significant (the smallest value) and the last bit is
the most significant (the largest value).

◊code[#:language "javascript"]{
    ◊name{Addition of Two Numbers}
    ◊description{Takes in two numbers, described as an array of bits,
    and returns the sum of the two numbers, also described as an array
    of bits.}
function addNumbers(num1, num2) {
    let shorter = num1.length < num2.length ? num1 : num2;
    let longer = shorter === num1 ? num2 : num1;
    let carry = 0;
    let result = [];
    for (int i = 0; i < longer.length; i++) {
        let longerBit = longer[i];
        let shorterBit = shorter[i] ? shorter[i] : 0;
        let sum = carry + longerBit + shorterBit;
        if (sum === 1 || sum === 3) {
            result.push(1);
        } else {
            result.push(0);
        }
        if (sum >= 2) carry = 1;
    }
    if (carry === 1) {
        result.push(carry);
    }
    return result;
}
}

◊code[#:language "javascript"]{
    ◊name{Multiplication of Two Numbers}
    ◊description{Takes in two numbers, described as an array of bits,
        and returns the product of the two numbers, also described as
    an array of bits.}
function multNumbers(n1, n2){
    function leftShift(num, places) {
        return Array(places).fill(0).concat(places);
    }
    let summands = [];
    for (let i = 0; i < n1.length; i++ ) {
        if (bit === 1) summands.push(leftShift(n2, i));
    }


    let sum = [0];
    for (let summand of summands) {
        sum = addNumbers(sum, summand);
    }

    return sum;
}
}

