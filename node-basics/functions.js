//- Functions Tutorial: ------------------------------------

// So, what is a function? It's somewhat similar to a function in math.
// Typically, you put things in, and you get things out.
//
// That's not the whole picture, but it's good enough for now. You don't
// *have* to put anything in. Sometimes that's appropriate. Sometimes
// the output is the same, no matter what, so you might as well put
// nothing in.

var itsAOne = function () {
	return 1
}

// What do you think the result of this is going to be?
console.log(itsAOne()) // 1

// And this?
console.log(2 + itsAOne()) // 3

// Now let's look at a familiar math function:

var squared = function(x) {
	return x*x
}

// And what is going to be the answer?
console.log(squared(4)) // 16

// Well, what exactly is going on here? You called the function (calling
// is the word for 'using' the function), and then, what, the
// `itsAOne()` got swapped with `1`?  Something like that. Really, what
// a function is, is a bundle of instructions. When you have something
// that you know you're going to do often, you turn it into a function.
// Alternatively, when you have a set of operations that you want to
// identify by a name, like 'clean my room' or 'do laundry', you turn
// that set of operations into functions like "cleanRoom" and
// "doLaundry". If you wanted to tell someone to clean their room, you
// wouldn't tell them to do so in terms of individual instructions, like
// "Pick up your clothes from the floor, set your bed, mop the
// floor...". You'd just say "clean your room". So, well-named functions
// can also make reading your program less of a chore. After all, a
// program is essentially a mathematically precise set of instructions.
//
// So, a function like `itsAOne` is a bad thing to turn into a function.
// There's no obvious reason why typing in `itsAOne()` is better than
// just `1`.  Whereas `square` isn't such a bad idea for a function.
// After all, you'll probably square things fairly often, and when you
// say 'square' it's obvious what you're trying to do. Of course, for
// more trivial examples like `x*x`, saying that 'squared' is better
// than `x*x` isn't a very obvious argument. Perhaps some may prefer
// `x*x` to `squared`, as it's shorter and they basically say the same
// thing. However, sometimes there are one-liners that aren't going to
// feel quite so obvious.

//- When to use Functions? ---------------------------------

// For a moment, let's ignore one of the mysteries that we saw earlier
// of the `1` 'taking the place' of the function call. We're going to
// put that on the side and look at the *point* of functions.

// So, here's a silly example. Suppose that you wanted to track how long
// something took. How would you do that? One simple way is to just tell
// your program to print something out when it's done.  Let's test how
// long some simple arithmetic takes.

console.log(1 + 2)
console.log("I finished!")

// That's a start. Let's do two more.

console.log(3 + 10)
console.log("I finished!")
console.log(250 + 367)
console.log("I finished!")

// So, I kept copy-pasting the "I'm finished." line. Hm. Now I want to
// go and change what it says from "End of previous operation. Start of
// new operation."
// This is something that you did more than once. So you might as well
// wrap it in a function.

var logFinished = function () {
	console.log("End of previous operation. Start of new operation.")
}

// Now, we'll try this again. We'll see how long some much more
// significant operations take.

console.log(100*100*100*100*100)
logFinished()
console.log(9999999*9999999*999999*9999999*999999)
logFinished()

// Hm. Not that much longer. I guess computers aren't that slow. How is
// it that the important things are always so slow.

//- How do Functions Work? ---------------------------------

// Let's look back at our old friend, `itsAOne`.

var one = itsAOne()

// That looks sensible, right?

var two = itsAOne()

// I wonder?
console.log("Is 1 = 2?", one === two)

// Well, let's take a look at what's going on. Without going too much
// into detail, once javascript sees a name, followed by '()', it knows
// that it is looking at a function call. So, it will *evaluate* the
// function, which means that it will execute all of the statements in
// 'itsAOne', in their order of
// appearance,  until:
//
// 1. It encounters a 'return' statement.
// 2. It runs out of statements.

// A 'return' statement says what the value of the evaluated function
// ought to be. So, in the case of `itsAOne`, javascript does the
// following:

// NOTE: The '>>> ...' is some javascript code, and the commented stuff is
// going to explain what's going on.

// >>> var one = itsAOne()
// This is an assignment, because there's an `=`. So I need to evaluate
// everything to the right of `=`, then take that value and place it in
// the variable 'one.
//
// Let's evaluate `itsAOne`.
//
// >>> itsAOne() Evaluting `itsAOne`
//
// >>> return 1 This is a return statement. The value to be returned is
// the value of the expression after 'return', which is `1`.
//
// >>> var one = 1 Place the value `1` in `one`.

// Now let's make things a little more interesting. What if there were
// other statements in the function?

var double = function (x) {
	console.log("I'm gonna double!")
	var dubs = x + x
	return dubs
}

var two = double(one)

// So, how is this evaluated?
//
// >>> var two = double(one)
// I need to evaluate `double(one)`, then take that value and assign it
// to `two`.
//
// >>> double(one) Evaluating `double(one)`:
//
// >>> console.log("I'm gonna double!") This is not a return statement,
// and there are more statements afterward. I will execute this
// statement, then execute the next statement. Which means I'll print
// "I'm gonna double!".
//
// >>> var dubs = x + x This is an assignment. To evaluate the right
// side, I have to take the value given to `x`, perform the addition `x
// + x`, then take that value and place it in `dubs`. This is not a
// return statement, nor is it the last statement, so I will also
// execute the next statement.  Since x is 1, dubs is 2.
//
// >>> return dubs This is a return statement, so the value of
// `double(one)` is the value of `dubs`, which is 2.
//
// >>> var two = 2 Assign `2` to `two`.

// These are the absolute, absolute basics of using functions.  There's
// more to learn. Some of it is important, some of it isn't. I'd say
// that the next important thing to learn about functions is 'scope'. I
// think you ought to learn about that another time. It's somewhat
// related to functions, but mainly because that's just how javascript
// is designed. It doesn't have to be related, but often is.  Many find
// that more intuitive.
//
// If you'd like to start thinking about 'scope', then try answering
// some of these questions on your own:
// - If I create a function, and then use a name inside of the function
// that was defined outside of it, what happens?
// - In a function like `double`, if I try to refer to `dubs` once
// double has finished executing, what happens?

//- Other Misteps With Functions: --------------------------

//--------------------------------------
// Make the names descriptive:

// Suppose you had a program that you wanted to do three things. I don't
// know what they are, but it's three things total. Perhaps it's to
// assist someone in getting directions, so you'd:
// 1. Take a location.
// 2. Return different ways to get to the location.
// 3. Allow the user to choose a route.
//
// Don't call the functions "thing1", "thing2", and "thing3".
// That won't help anyone who reads the program, including you. Call
// them things like "getLocation", "displayDirections", and
// "chooseRoute".
//
// In general, more information is better than less, but more
// information can lead to problems, too. So be careful not to make the
// names too long, either. This is a delicate balancing act, and not
// everyone will agree on what is and is not too much. You'll learn your
// own preferences with time.

//--------------------------------------
// Don't make your functions too large:

// That's just as bad as not making a function at all. Functions are
// about breaking a problem into manageable pieces. Giant pieces aren't
// manageable.  That's not to say that a function can't do a lot of
// things, or take a long time. Sometimes they will. But typically, when
// a function does a lot, it's not because the function is long to
// describe, it's because it contains pieces that do a lot of work, too.
//
// To give you a visual, you should approach a program like putting
// legos together. There's some simple basic pieces you get to choose
// from, like arithmetic on numbers, lists, printing, and such. With
// functions, you get to put these basic pieces together into something
// bigger.
//
// So, suppose, in terms of lego blocks, you had one block that was the
// size of a city; that's how many lego blocks were in it. If you built
// that block in terms of individual bricks, it would be very hard to
// wrap your mind around, let alone explain to anyone else. That is what
// a function that is too large feels like. However, if you build your
// city-wide block out of a series of building-sized blocks, then the
// function, while large, is feasible to follow and explain. If you
// wanted more information, you'd dig into each of the buildings. And if
// you wanted even more information, you dig into all the pieces that
// made up the buildings. This approach is far more manageable.

// Once again, this is a balancing act. In the beginning, you'll
// probably just do what gets the job done. Eventually, you'll have to
// figure out how to write things in a way where the reader can get the
// right level of detail whenever they need to. They should be able to
// get high-level overviews easily from well-written, well-organized
// functions, and they should be able to dig into the nitty-gritty
// easily both by being able to figure out which details are where (due
// to good names and good organization), and then be able to digest
// those details.

//--------------------------------------
// Know when to break the rules:

// All the guidelines I've given you on when to use functions are
// *guides*, not *absolutes*. There will be times when a giant function
// is the most reasonable choice. Those times are *very rare*. Once
// instance might be when you're working on a project that's not yours
// and there are already poor choices in place that force your hand and
// make you write huge functions. Sometimes, if it's someone else's
// work, you end up choosing between starting from scratch and sticking
// with the way that they did things.
