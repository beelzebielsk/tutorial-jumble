/* Write a function findElement that takes as arguments:
 * 1. An array.
 * 2. A truth-test : a callback function that takes a single value as
 *    argument, and returns either true or false.  
 *
 * The function will return the first element in the array that passes
 * the truth test, or undefined if no such element is found.
 */

let isEven = num => num % 2 === 0;
findElement([1, 3, 4, 5], isEven);
// => 4

findElement([1, 3, 5], isEven);
// => undefined

//Your Answer:
function findElement (arr, cb){
	for (var i = 0; i < arr.length; i++){
		return cb(arr[i])
	}
}

let tests = [
	[],
	[0],
	[1],
	[0,1,2,3],
	[1,3,5,7],
]

tests.forEach(test => console.log(findElement(test, isEven)))

/* Let's look at some outputs for this code:
 * - []        : undefined
 * - [0]       : true
 * - [1]       : false
 * - [0,1,2,3] : true
 * - [1,3,5,7] : false
 *
 * Is this what you would've expected? The question told you to:
 * - Take an array, and a callback.
 * - The array would hold some data, and the callback would be something
 *   like a filtering function: if the function returned true, then you
 *   found the element you were looking for, otherwise, keep looking,
 *   and if you never find an element, then return undefined.
 *
 * Okay. The question description gives us an important detail:
 *
 * The callback (cb) should return either TRUE or FALSE. You do NOT want
 * to return the result of the callback function, because, as you can
 * see above, the only return values you ever got were
 * true/false/undefined.
 */

