//- Intro to Callbacks: ------------------------------------

// Alright. So, it seems that you're having trouble with visualizing
// what happens with callbacks. Let's see if we can change that.

// A function is like a recipe. It takes in ingredients as inputs, and
// then does things to cook a meal when you "invoke the recipe". The
// whole point of callback functions is to make some general patterns
// easy to do.

// So, let's first explore the concept of `map`. For our purposes, we're
// going to call this function `transform` instead. You want to take all
// of the elements in an array and transform them somehow.

// Let's look at three special cases:
// - incrementing every element in an array
// - Doubling everything in an array.
// - Squaring everything in an array.

function incrementArray(arr) {
	var newList = []; // In general, don't modify arrays unless necessary.
	
	// We're going to perform some transformation once per element of the
	// array.
	
	for (let i = 0; i < arr.length; i++) {
		let oldThing = arr[i];

		// For each element, we create the corresponding new element in the
		// new array by transforming it.
		// NOTE: Do not do something like:
		//	newThing = arr[i]++
		//  `++` mutates whatever it is applied to, and we're not trying to
		//  change the original array. The new array will come out wrong,
		//  and the old array will be changed.
		
		let newThing = oldThing + 1;

		// Take the new thing, and add it to the new array.
		newList.push(newThing);
	}
	return newList;
}

function doubleArray(arr) {
	var newList = [];
	for (let i = 0; i < arr.length; i++) {
		let oldThing = arr[i];

		// Note that between the previous function and this function, the
		// only line that changes is the line for describing the
		// transformation that produces the newThing from the oldThing.
		
		let newThing = oldThing * 2;
		newList.push(newThing);
	}
	return newList;
}

function squareArray(arr) {
	var newList = [];
	for (let i = 0; i < arr.length; i++) {
		let oldThing = arr[i];

		// Same here. Only one line changes.
		
		let newThing = oldThing * oldThing;
		newList.push(newThing);
	}
	return newList;
}

// We have a pattern here! A pattern that repeats. Whenever we have a
// pattern that we'd like to repeat, we turn it into a function. It
// would be really nice if we could create a new function that does
// everything that these previous three functions do, but we can change
// the transformation that's used to create a newThing from an oldThing.
//
// Well, to our knowledge, the only (sensible) thing that we can use to
// change the behavior of a function is a parameter.
//
// And this is the idea behind map, and behind a lot of functions that
// are similar to map. We're going to make the transformation a
// parameter to the function. So, let's see this map function:

function map(arr, transformation) {
	var newList = [];
	for (let i = 0; i < arr.length; i++) {
		let oldThing = arr[i];

		// That's it. We make this one line general. We do it be allowing
		// the user to pass in a function, which we call `transformation`,
		// which takes in the oldThing and returns the desired newThing.
		
		let newThing = transformation(oldThing);
		newList.push(newThing);
	}
	return newList;
}

// And using this general pattern, we can redefine the three previous
// special cases we did in terms of map, instead of writing them out
// each time:

var incrementArray = function(arr) {
	return map(arr, function (old) { return old + 1; });
}
var doubleArray = function(arr) {
	return map(arr, function (old) { return old * 2; });
}
var squareArray = function(arr) {
	return map(arr, function (old) { return old * old; });
}

// These new definitions and the old definitions of the functions are
// functionally equivalent. If you pass in an array into the old
// functions and the new functions, the results will be the same for the
// old and new functions.
//
// NOTE: I did not have to name the parameter `old`. There is no
// connection between the parameter name of the transformation function
// and any of the names defined in the `map` function.

// So, in `map`, the transformation parameter is what we call a
// `callback` function. The idea is that you pass in the callback
// function into a calling function so that you can specify a piece of
// how the calling function works without:
// - Having to know exactly how the calling function works.
// - Having to alter the calling function in any way.
//
// There is no difference between a "normal function" and a "callback
// function". There are only functions. Saying that "callback functions
// are all functions, but functions are not callback functions" is like
// saying that "borrowed cars are cars, but cars are not borrowed cars".
// What? The only difference between the callback functions and "normal
// functions" is whether you will explicitly invoke it in your code, or
// another function will invoke it on your behalf, much like the only
// difference between a car and a borrowed car is whether you'll be
// driving the car, or someone else will be driving the car.

//- Functions as Values: -----------------------------------

// It seems that you're not really clear on the idea of a function as a
// value. Going back to the example of a function `asdf` (real
// creative):

var asdf = function(argument, callback) {
	return callback(argument);
}

// You said that the following invocation of `asdf` has *3* arguments:

asdf(5, function(x) {
	return x * 3;
});

// This is false. So, let's look at some values and compare.

// Variables hold values. That is what they do.

var number = 5;

// The variable `number` holds the value `5`, here. If I were to call a
// function with the variable number, such as:

console.log(Math.pow(number, 2));

// I'd see 25, because the result is 5 squared. I can get the same
// result by replacing `number` with the value of number, which is 5.

console.log(Math.pow(5, 2));

// This should also come out to 25.

var aString = "Can strings get tangled?"

// If I were to call a function with this string, I could, once again,
// call the function using the name `aString`, or the value that
// `aString` holds, which is everything in the quotes.

var aFunction = function(x) { return x * 3; };

// Similarly, aFunction holds a *value*, and that value is a function.
// !!!!Everything to the right of the equals sign is one whole value!!!!
// To reiterate:
//
// var aFunction = function(x) { return x * 3; }
//     ---------   -----------------------------
//       name             one whole value

// In fact, check this out, just to prove my point:

console.log(aFunction.toString());

// The textual representation of a function can be printed out again.
// And if you look at it, all of the text of the function that you're
// seeing **all becomes one value**.

// Let's really drive home the point:

// If I call `asdf` using `aFunction`:

console.log(asdf(5, aFunction));

// I should be able to get the same result here by substituting
// `aFunction` for the value that `aFunction` holds. So, starting from
// the comma, and ending with the last parenthesis of the argument list,
// I will write the function that aFunction holds.

//      Start of `aFunction` value    End of `aFunction` value
//                  |                           |
//                  v                           v
console.log(asdf(5, function(x) { return x * 3; }));
//              ^                                ^
//              |                                |
//      Start of Parameter List       End of Parameter List

// The function value starts with the `function` keyword and ends at the
// ending brace of a function definition. Always (tiny lie in there, but
// by the time you learn about it, you'll see how tiny the lie is).

// The spacing used in defining the function does not matter. The
// function is still all one value even if I write:


console.log(asdf(5, function(x) {
	return x * 3; 
}));

// Or even:

console.log(asdf(5, function(x) 
	{ 
		return x * 3; 
	}))

//- Filter: ------------------------------------------------

// So, now that we've seen a bit on how callbacks work, let's look at
// the `filter` method.
//
// Again, let's start with some special cases:
// - An onlyNumbers function, which takes an array and returns only the
// numbers in the array.
// - An onlyEven function, which takes an array and returns only the 
// even numbers in the array.

function onlyNumbers(arr) {
	var newThing = []
	for (let i = 0; i < arr.length; i++) {
		let testThing = arr[i];
		if (typeof testThing == 'number') {
			newList.push(testThing);
		}
	}
}

// Again, here everything is the same, except for the condition that we
// use to decide whether or not to keep something.
function onlyEven(arr) {
	var newThing = []
	for (let i = 0; i < arr.length; i++) {
		let testThing = arr[i];
		if (testThing % 2 === 0) {
			newList.push(testThing);
		}
	}
}

// Filter is somewhat similar to map. Map transforms an array by taking
// each element, passing it through a transformation function, and
// placing the transformed element in the resulting array. Filter, on
// the other hand, transforms an array by passing it through a *test*
// function, and placing in the resulitng array those testThings that
// passed the test:

function filter(arr, test) {
	var newList = []; // In general, don't modify arrays unless necessary.
	for (let i = 0; i < arr.length; i++) {
		let testThing = arr[i];
		if test(testThing) {
			newList.push(testThing);
		}
	}
}

// And we can, of course, express the two specific cases in terms of the
// general case filter function.

var isNumber = function(value) { return typeof value === 'number'; }
var isEven = function(value) { return value % 2 === 0; }

var onlyNumbers = function(arr) { return filter(arr, isNumber); }
var onlyEvens = function(arr) { return filter(arr, isEven); }
