//Write a function findElement that takes as arguments:

//1. An array.

//2. A truth-test : a callback function that takes a single value as argument, and returns either true or false.

//The function will return the first element in the array that passes the truth test, or undefined if no such element is found.

findElement([1, 3, 4, 5], function(num){ 
  return num % 2 === 0; 
});
// => 4

findElement([1, 3, 5], function(num){ 
  return num % 2 === 0; 
});
// => undefined

//Your Answer:
function findElement (arr, cb){

for (var i = 0; i <arr.length; i++){

 return cb(arr[i])

}

}
