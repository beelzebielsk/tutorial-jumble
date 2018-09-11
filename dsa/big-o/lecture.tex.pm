#lang pollen

◊h1{Introduction}

◊h2{Timing Functions}

Before we look at Big O, we'll be looking at describing the time it
takes for a function to execute.

How would you do this? If you had a machine in front of you, you could
ask the machine to time the program that you're running. One of the
points of Big-O is to separate you from the details of any particular
machine, however. So let's use a different approach.

Let's start with some basic rules. We'll discover a few more as we go
along.

◊rule[#:name "evaluate"]{The time it takes to evaluate any arithmetic
expression is 1 second.}
◊rule[#:name "eval-name"]{If an expression is just one number or name,
then no time is required to evaluate it.}
◊rule[#:name "assign"]{The time it takes to assign a value to a name is 1 second.}
◊rule[#:name "invoke"]{No time is required to invoke a function, and
no time is required to return a value from a function.}

You might wonder where these rules come from. I made them up, they're
probably very incorrect for any real machine. But what we're doing in
reality is making up the rules for a machine that's not real, but in
our minds. An ◊term{abstract machine}.

◊example{
How much time would the following function take when invoked on our
imaginary machine?

◊code{
function f() {
    let x = 1;
}
}

Well, the function invocation itself takes no time. The only statement
in the function is an assignment of a value to a name. According to
◊rule['assignment] and ◊rule['assign-num], the one statement takes
just 1 second.
}

◊example[#:label "big-statement"]{
What about the following function?

◊code{
function f() {
    let x = 1 + 3;
}
}

Well, the function invocation itself takes no time; this fact should
be obvious by now, and we'll omit it from future examples. The only
statement in the function is an assignment of the result of an
arithmetic expression to a name.
According to ◊rule['assignment] and ◊rule['arithmetic], the one
statement takes just 2 seconds: one for evaluating the expression
◊code{1 + 3}, and then 1 second for assigning the result to ◊code{x}.
}

◊h2{Dealing with Functions that have more than one statement}

What about functions with more than one statement? How do we figure
out the time it takes for these functions? We've actually stumbled
onto this rule already. When handling example
◊example['big-statement], we broke the statement down into the
different pieces that took time, figured out how much time they'd
take, and then ◊em{added them altogether}. This leads us to our next
rule:

◊rule{The time required to execute a series of statements is the sum
of the time required to execute each statement.}

◊e{
How much time does the following function take to execute?

◊code{
function f() {
    let y = 1 + 10;
    let x = 3 + 2 + 3;
    let z = y + x;
    let a = z;
}
}

◊answer{There are four statements. The time that the 1st, 2nd, and
3rd statements take to execute is 2 seconds each: 1 second for
evaluating an arithmetic expression, and 1 second to assign the
expression's result. The time to execute the last statement is 1
second: 1 for the assignment, and no seconds for evaluating the the
value to assign (due to ◊rule['eval-name]). The final time is thus 6 +
1 = 7 seconds.
}
}

◊h2{Statements whose time to execute is unknown}

Now for more interesting things. What happens when our program makes a
decision? That's one of the chief abilities of a computer. How do we
analyze this case? Except in rare circumstances, we don't know ahead
of time if a conditional statement will execute its body or skip it.
We have to run the program first.

There is no correct answer. How you choose to examine the time this
takes really depends on what you want to analyze. We won't explore our
choices much in this document; the choice that we will make is to
◊em{assume the worst}. Of the two things a conditional could do, we
will assume that it takes the time of the longest possible thing that
could happen. If a conditional statement skips its body, then fewer
instructions are executed. If a conditional statement executes its
body, then more instructions are executed. Thus, the worst possible
case is for ◊em{the conditional to execute its body}.

◊rule{For worst-case time analysis, if a statement may have different
execution times under different conditions, just assume the statement
takes the longest possible time of those times it may take.}

◊example{
Here is a silly function, which takes a single argument which is equal
to either ◊code{true} or ◊code{false}. How long does it take?

◊code{
function sillyFunction(decision) {
    if (decision) {
        3 + 4 + 5;
        6 + 7 + 8;
    }
}
}

There are two possibilities here: the amount of time that the function
could take if the body is executed (ie if ◊code{decision === true}) or
if the body is skipped.

Either way, the test expression in the conditional must be evaluated.
The test expression is just a name, so according to ◊rule['eval-name],
evaluating the test expression takes no time at all.

If the body executes, then it will take 1 second per statement,
yielding 2 seconds total.

If the body does not execute, then it will take just the time required
to evaluate the test expression: 0 seconds.

Thus, ◊answer{the worst-case time is 2 seconds}, and that is the time
we will assume the conditional takes in any further exercises and
examples.
}

◊note{
Why choose the worst case?

There's lots of reasons, but one of them is because it's easy. In
order to figure out the worst-case time of something, you need to
figure out what cases are possible, but the final answer is the answer
of all the cases. Another possibility is to ◊em{assume the best}. This
is also easy---as easy as assuming the worst. But of the two
measurements, which would you prefer to use for measuring how long
something takes? The worst-case result is the longest something could
possibly take. The best-case result is the shortest something could
possibly take.
}

◊e{
How long would the following function take?

◊code{
function f(decision) {
    if (x === 2 && decision !== true) {
        let y =  2;
    }
}
}

◊answer{This is a kinda complicated expression, but, so long as we
break it apart into pieces, we'll be fine. The time that this will
take is the time required to evaluate the test expression + the time
required to evaluate the body statements. The test expression is a
boolean expression. It contains boolean operators and produces a
boolean value. We have not mentioned these before. Assume that the
time required to evaluate boolean expressions works just like
evaluating arithmetic expressions: ◊rule['eval-name] says that no time
is required to evaluate a value or name (eg ◊code{decision} or
◊code{true}). So the test expression takes 1 second to execute.
}
}

◊ignore{
◊e{
How long would the following function take?

◊code{
function f(decision) {
    let x = 1;
    let y = x === 2 ? 2 : 3;
    if (decision !== true) {
        let z = 10;
        z = z;
    }
}
}

◊answer{There are 5 statements in this function.}
◊ol{
- 1 second 
- worst-case time of 2 seconds.
- The body statements of this conditional each take 1 second, meaning
that the body takes 2 seconds total. The test expression is not just a
name/value this time, it is a boolean expression. We never spoke about
those before. Assume that they are the same as arithmetic expressions.
So the test expression takes 1 second to execute. Thus, the worst-case
time taken is 
}
}
}

Based on the previous exercise, we should amend ◊rule['eval-name] and
◊rule['evaluate] to cover boolean expressions and the names of the two
boolean constants ◊code{true} and ◊code{false}.

◊rule[#:name "eval-name2"]{If an expression is any constant, whether a
name or a boolean constant, or any name, then no time is required to
evaluate the expression.}
◊rule[#:name "evaluate2"]{The time it takes to evaluate any expression
using a built-in operator is 1 second.}

◊h2{Functions with Repetition}

Finally, we're going into repetition. This is where things get more
difficult. Figuring out how long a program takes when it contains some
form of repetition ultimately boils down to figuring out how often the
repetition occurs. It's really that simple---but sometimes it is not
simple to figure that out.

◊rule[#:name "repeat"]{To figure out the time a reptition will take
(such as a loop or a recursion), first figure out how often the
repetition will take place.}

◊example[#:label "baby-loop"]{
How long will the following take?

◊code{
function f() {
    let i = 0;
    while (i < 5) i = i + 1;
}
}

The 1st statement takes 1 second.
What about the 2nd statement? By our most recent rule, ◊rule['repeat],
the time that this statement will take depends on how many times it
will repeat. Intuitively, we know that it will repeat about 10 times:
that's true enough. Let's examine exactly how much time it will take.
When you know how often a loop will execute ahead of time, you can
"unwrap the loop". Replace the loop by all of the instructions that
will be executed while the loop repeats, as if the loop was written
"by-hand". So, the following code snippet will take as long as the
above loop:

◊code{
0 < 5;
i = 0 + 1;
1 < 5;
i = 1 + 1;
2 < 5;
i = 2 + 1;
3 < 5;
i = 3 + 1;
4 < 5;
i = 4 + 1;
5 < 5;
}

Each of the assignment statements takes 2 seconds. Each of the test
expressions takes 1 second. There's 6 (◊${ = 5 + 1}) test expressions
and 5 assignment statements, making for 16 seconds total.
}

Notice how long this program took despite being one of the shortest
we've written so far. ◊point{The bulk of time that a program takes to
run is generally due to repetition}.

What do you do if you don't know how often the loop will run ahead of
time? Well, the number of times that something will repeat isn't
random. That count tends to be related to something else in the
program. For ◊example['baby-loop], the number of times that the loop
repeated was related to the number ◊code{5}, which was in the test
expression.

We use repetition when we're working with data structures that are
made out of many small pieces. An example of this is string comparison. 

◊example[#:label "unknown"]{
How long would this string comparison function take to run?

◊code{
function stringCompare(str1, str2) {
    if (str1.length !== str2.length) {
        return false;
    }
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) {
            return false;
        }
    }
    return true;
}
}

Oof. We just jumped in complexity. Two conditionals, and a loop, and
we're not even sure how often the loop will repeat!

The main way that we work on complicated situations is to reduce them
to things that aren't complicated, and then combine our simple
findings. What this means here is breaking down this statements into
the smaller pieces that we already learned how to deal with.

The 1st statement is a conditional. How long does that take? We break
this down into the test expression and the body statements. The test
expression deals with something we haven't seen before: 
◊term{member access}. 

◊rule[#:name "member"]{member access takes 0 seconds.}

We'll assume that member access takes 0 second all the time. Thus the
time required to evaluate the test expression is the 1 second required
to evaluate the boolean expression.

The body statement is a return of a value. This takes 0 seconds. The
worst-case time of this statement is 1 second.

Next, we'll tackle the conditional inside of the loop. It's very
similar to the previous conditional if we use the following rule: 

◊rule[#:name "index"]{Consider indexing an array/object to be the same
as member access.}

So, the body statement takes 0 seconds, the test expression takes 1
second, thus the whole statement takes 1 second (worst-case).

The last statement takes 0 seconds, too.

Now, we're at the last part: the loop. This is similar enough to
◊example['baby-loop]. We have a loop that will execute for as many
times as there are characters in the string ◊code{str1}. We just don't
know how many characters there are in the string.

◊rule[#:name "unknown"]{When you're dealing with a quantity that's
unknown, you may give that quantity a name, and describe the time a
function takes to execute in terms of that name.}

◊let-splice[([length (text-in-math "length")])]{
So, we will describe the time the loop takes to execute in terms of
the length of the string, which we will name ◊|length|.

The loop will execute ◊length times; we'll use a method
similar to ◊example['baby-loop], where we "unwrapped" the loop. In
that example, we unwrapped the loop and noticed that:

◊l{
- The test expression occurred ◊${5 + 1 = 6} times. Analogously, the
test expression in our loop will occur ◊${◊length + 1}
times.
- The loop body occurred ◊length times.
- The update expression happens ◊length times (it's basically this
extra statement that happens at the end of the loop, so it happens as
often as the loop body happens).
}

Thus the total amount of time that the loop takes is 
◊${ (◊length + 1) + ◊length + ◊length = 3 * ◊length + 1}.
}
}

◊h1{Shortcomings of Timing Functions}

Let's take a break from these timing functions. We should have the
basic idea down by now. Of all the timing functions we saw, perhaps
the strangest one was the timing from ◊example['unknown]. The amount
of time it actually took depended on the input.

Wait. "The time it ◊faceitous{actually} took?" Didn't we agree that
this ◊finger-quotes{machine} wasn't real? That it was an abstract
machine?

How much time would these functions have taken on a different machine?
We don't know. Some things would change about the times, and some
things wouldn't. 
◊l{
- What would change: All the rules that gave exact times of execution
for a statement/expression.
- What would not change: All the rules for combining times of many
statements, and figuring out the times of statements that are not
known ahead of time.
}

◊h2{Comparing Two Functions/Algorithms}

Suppose that we had two different functions that did the same thing
(meaning it took the same input and returned the same output). How
would we compare them? The answer is ◊em{depends on what you want}.
There's different criteria, but the one we will talk about today is
◊em{time}. We've already been speaking about it up to this point.

◊todo{Come up with algo for something where timing functions are
different with different times for operations}.

This situation is bad. Each algorithm has a machine on which it
performs superior to the other. This means that we can't actually
compare the running time of two algorithms without first picking the
machine that they're going to run on. And, with this said, how would
we even figure out the running time of these algorithms for all of
their different inputs? Machines are physical things. Proving a timing
function mathematically for them would be extremely difficult. There
are so many uncontrollable things that would affect the time it takes
for an algorithm to complete on a real machine (like whether or not
the machine is plugged in).

Imagine if all of your interivew questions about time analysis started
with "Suppose our machine is plugged in." No good.

◊h1{Big O}

The original idea we had of timing algorithms by an abstract machine
was a good one. We had no need of using a finicky real machine.
However:

◊l{
- figuring out the timing functions was somewhat labor-intensive
- It's not reasonable to assume that all of our operations will take
place in either 0 or 1 seconds. The assumption that something takes 0
seconds is ◊em{especially} suspect.
}

Doing better than these timing functions means that we need to
understand our priorities for measuring these timing functions. Do we
want absolute precision for timing? This may surprise you:

◊point{No. We do not care about absolute precision on timing.}

We already conceded that we're measuring the time on an imaginary
machine in the 1st place. Who cares about precision for measurements
of something imaginary?

The way that computer scientists have chosen to compare the running
times of algorithms is based on how those running times ◊em{grow as
inputs get larger}.

We do not use computers for small things. Or, at least we don't worry
about how they function on small cases. Computers tend to be used for
tedious and repetitive tasks that are far too repetitive for a human
to do. There's just too many steps for us to keep track of. So we're
more interested in seeing how algorithms will perform when they have
to perform a large numbe of steps.

◊l{
- We use computers for large things.
- We track growth because, at some point, some functions just totally
outclass others when ◊${n} gets really large.
- In fact, that's what Big O actually means. There's a choice of ◊${
n} for which one function's value is larger than the other function's
value for this ◊${ n} and all larger ◊${ n}.
- We could use Big O for different things. If you visit the wikipedia
entry on Big O, you'll see that there's lots of different contexts
under which its used. Big O means the same thing no matter what, but
you can interpret it a little differently based on the context. It's
always a method of comparing two functions.
- Let's look at the Big O of some functions. Let's compare the
procedure for finding the Big O of a function with the process of
finding the timing function of a function. Big O is a little easier.
The exact number of instructions doesn't matter, so that's a help. You
still add the Big O of individual statements to get the Big O of a
series of statements, but adding up Big O's just leaves the "largest"
Big O.
- More examples:
    - DFS Big O. How do we know that it's linear in the nodes of the
    tree/graph? The diff between tree BFS and graph BFS is small; if
    you use tree BFS on a graph, the algorithm may never terminate
    (meaning that it is not actually an algorithm). Either way, the
    Big O of it is much larger than you'd have originally thought.
    - BFS Big O. We just know that the loop keeps iterating while
    we've got nodes in the queue. We can infer that the number of
    nodes that will enter the queue is the number of nodes in the
    tree. But... couldn't we do worse? If we did, how would we even
    know? If we put a node in the queue ◊${ n} times, we'd get
    quadratic performance, for instance.
    - Something recursive. How do you get the Big O of a recursive
    algorithm? Is the Master thm the only choice  we have? 
    - Boolean Satisfiability: an example of exponential complexity
    - Permutations, perhaps, as an example of factorial complexity.
    - Fill out some algorithms/processes with different time
    complexities. Try to stick to things that are intuitively easy to
    explain. The original lecture notes are a decent source for that.
}
