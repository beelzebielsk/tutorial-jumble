#lang pollen

Introduction
============

I'm going to teach you the CS definition of ◊O notation, and then
explain how the industry definition of ◊O relates to that. I'm gonna
do this because the industry definition of ◊O is imprecise. The CS
definition is very precise. So, the CS version will serve you much
better. Also, the CS version suggests how you are to measure the ◊O of
a program.

Big Picture: ◊O is a way of comparing the "size" of two different
functions. For numbers you have relations like ◊${ \leq} and ◊${ \geq} and
◊${ =}. ◊O establishes similar relations for functions.

What's a Function?
==================

This point can be confusing, because function can mean different
things in different contexts.

◊l{
- In Math: A function is a relation between an input and an output. A
function specifies what output comes from a specific input. For
instance, the function ◊${ f(x) = x^2}, where ◊${x} is an integer is a
relation that states "for an integer, ◊${ x}, the output of ◊${ f} is
the integer ◊${ x^2}".
- In Programming: A function is a series of instructions along with a
set of parameters. This may or may not return a value.
}

The two concepts are very related. They sound similar enough to each
other, but they're not quite the same thing. The function in
mathematics is a relationship: each input is related to it's output.
The function is really a set of the pairs of inputs to outputs.

In programming, a function is a description of how something ought to
happen. The result that's returned is returned by the result of
following a series of instructions that act on the parameters of the
function. In math, there is no notion of ◊em{how} a function ought to
be performed. You don't have to be able to calculate it. You just have
a relationship between the inputs and the outputs. Furthermore, a
function in programming does not need to behave like a mathematical
function. For instance, a function that returns a random value is not
a mathematical function: for the same input, different outputs are
returned. There is no relationship between the inputs and outputs like
there are for mathematical functions.

What are some common functions you'll encounter?
================================================

◊l{
    - Constant Function: This is a function ◊${ f} of the form ◊${ f(x) =
    c}, where ◊${ c} is any number. You can see these often enough in
    nature. For instance, the relationship between the number of times
    you sneeze in a day and the height of your apartment is a constant
    function: the # of times you sneeze is unrelated to the height of
    your apartment, and the height of your apartment does not change.

    - Logarithmic Function: This is a function ◊${ f} of the form ◊${ f(x)
    = c ◊log{x}}, where ◊${ c \neq 0}. Logarithms have a ◊term{base},
    ◊${ b}, and the actual input to the function, ◊${ x}. Logarithms
    and exponents are very closely related. You see these two
    often enough in nature, too. Some examples:
        ◊l{
        - How many times do you need to fold a piece of paper in half
        to make it 1/8th it's original size? Once, twice, three times.
        Thus ◊log[#:base 1/2]{1/8} = 3.
        - Suppose, if you spread a rumor to 3 of your friends, your 3
        friends will always do the same, spreading the rumor to 3
        people that have not yet heard the rumor. Suppose that the
        same is true for your friends' friends, and their freinds'
        friends and so on: each time any person hears the rumor, they
        are sure to tell exactly 3 people that have not heard the
        rumor before. Let's call each time the rumor spreads a
        ◊finger-quotes{wave}. So you're the 0th wave, the 1st 3 friends
        you tell are the 1st wave, the 9 people that are told next are
        the 2nd wave, and so on. On which wave will at least 400 new
        people hear about the rumor? How many waves are required so
        that at least 400 people total have heard the rumor?

        We can answer the 1st two questions at almost the same time:
        ◊l{
            - Wave 0: 1 person knows (you).
        ◊list-splice{
        ◊(let ([geometric-series (λ (r n) (/ (- (expt r (+ 1 n)) 1)
                                                (- r 1)))])
        (for/list ([n (in-naturals 1)]
                     #:when (and (< (expt 3 (sub1 n)) 400)
                                 (< (geometric-series 3 (sub1 n)) 400)))
                    ◊i{Wave ◊|n|: ◊(expt 3 n) new people know, making
                    for (geometric-series 3 n) people that know.}))
        }
        }
        }

    - Linear Function: This is a function ◊${ f} of the form ◊${ f(x)
    = ax = b} where ◊${ a \neq 0}. We require this because if ◊${ a =
    0}, then we're left with a constant function. You see this
    relationship often enough in nature, too; any time that you see
    two quanties that are proprotional to one another. "If you move
    twice as fast, you're twice as hard to stop."

    - Quadratic Function: This is a function ◊${ f} of the form ◊${ f(x) =
    ax^2 + bx + c}, where ◊${ a \neq 0}. We require that ◊${ a \neq 0}
    because if ◊${ a = 0}, then we're just left with a linear function.

    - Larger powers of polynomials, where the power is ◊${ n}: These
    are functions ◊${ f} of the form 
    ◊${ f(x) = c_0 + c_1 x + ... + c_n x^n } where ◊${ c_n \neq 0}.

    - Exponential Function: This is a function ◊${ f} of the form ◊${ f(x)
    = c b^x}, where ◊${ c \neq 0} and ◊${ b \neq 1}. 
    = b$ where ◊${ a \neq 0}. Power sets is an example of this (all
    possible combinations).

    - Factorial Function: This is a function ◊${ f} of the form
    ◊${ f(x) = !x = x (x-1) (x-2) ... 1}.

}


◊footnote{
    ◊content{The point of ignoring constants is to shield ourselves
    from the idea of "faster computer" and "slower computer". Big-O
    DELIBERATELY ignores this-- part of the reason that we use Big-O
    is to have a way of judging an algorithm that's totally
    independent of the machine that it runs on. We never want to have
    to say "well, algo 1 outperforms algo 2 on machine a, but it's the
    opposite on machine b". If we have to say that, then our judging
    criteria can totally change based on the machine. Machines change
    with time, algorithms don't. So you'd want to keep the method of
    judging completely independent of the machine that the algorithm
    is going to run on. That's not to say that we always ignore the
    machine, but when judging the algos on a theoretical basis, we do.
    }
    ◊note{I've heard this explanation, too: some CS people feared that
    attaching the meaning of performance to a machine would allow
    industries to fuck with what it meant for an algorithm to be fast.
    Imagine an industry selling a computer because it made sorting
    fast, in particular.  Imagine if the creation of algorithms was
    accompanied by flashy buzzwords; they could've been products that
    were "manufactured" and sold. By keeping their judgment simple and
    esay, and unchanging regardless of the machine that the algorithm
    would run on, we avoided something like that.}
}

Another way to look at this is to see the algorithms as all running on
the same abstract (theoretical) machine. We judge them that way
instead of trying to put them on a machine and judge them.

Big O can be seen as a bound, as a comparison of two functions. If
you're thinking of it as a comparison, then it's comparing the
function of time of the algorithm to another function. If you're
thinking of it as a bound, then you're stating a function which bounds
the time function of an algorithm (or space function).

1st Step in Determining Big O: Deriving Time Function
=====================================================

The long way of figuring out the Big O of a function is to figure out
how much time the function takes, literally. As in, the number of
steps it takes to complete, stated as a function of the input size.

Here are some example time functions:

◊l{
- ◊f{n} = 1
- ◊f{n} = n
- ◊f{n} = 2n
- ◊f{n} = n^2
- ◊f{n} = n^3
- ◊f{n} = !n
- ◊f{n} = 3^n
}

What's ◊${ n}? Well, it's the size of the input to the
◊finger-quotes{programming} function. The size of the input tends to
change from problem to problem, from input to input. For one input,
there may be different ways of characterizing it's size. For an array,
we describe it's size by the number of elements that it has. For a
number, you can describe it's size through it's value, or through the
number of bits required to write the number. You choose the measure
that's appropriate to the problem. For instance, the numeric value is
an appropriate measure of size for something like Euler's GCD
algorithm. But for something like grade-school addition of two
numbers, the size is best described in terms of the # of bits, because
addition happens bit-by-bit (digit-by-digit).

Sample Algorithms
=================

Linear search:

◊code[#:language "javascript"]{
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

Addition of Two Numbers:
◊code[#:language "javascript"]{
    ◊description{Takes in two numbers, described as an array of bits,
        and returns the sum of the two numbers, also described as an
    array of bits. Assume that the two numbers have the same # of
    bits.}
function addNumbers(num1, num2) {
    let carry = 0;
    let result = [];
    for (int i = 0; i < num.length; i++) {
        let sum = carry + num1[i] + num2[i];
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
}
}

Multiplication of two Numbers:

◊code[#:language "javascript"]{
    ◊description{Takes in two numbers, described as an array of bits,
        and returns the product of the two numbers, also described as
    an array of bits.}
function multNumbers(n1, n2){
    // Figure out how to quickly code a shift of numbers, or how to
    // ignore that entirely.
    let summands = [];
    ◊todo{finish this. It's a nice break from bubble search and shit
    that's also quadratic time. And it's a nice demonstration of
    demonstrating different ways to describe the size of the input.
    Because if you consider the # of bits of each number, then the
    time complexity of this algo is ◊O{◊log{n}^2}.
}
}

Different ways of chosing elements of a set without repetition.

◊code[#:language "javascript"]{
    ◊description{This function takes in a set, `s` (represented as an
    array, assume numbers for now) and returns the set of all ways to
    take stuff from `s` without repeating.}
    ◊todo{Finish or remove. I can't figure out the timing function for
    this. I can make the appeal that it ought to be at least
    exponential, because the result is a list of length ◊${ 2^n} where
    ◊${ n} is the length of `s`.
}

Breadth-First Search

◊me-note{You can describe this as exponential time, if you describe
the size of the tree as the ◊${ branching factor ^ depth}. If your
point of view is considering the number of nodes in the tree, then
◊O{number of nodes} is fine. However, there are times when
◊O{branching factor ^ depth} is better, such as when you're dealing
with a massive tree, and you want to get a sense of how fast your
search size will grow as you progress down the tree. For instance,
this pops up in AI, because often enough, an AI boils down to
searching for the best decision in a tree of decisions (the tree works
like: each node is a decision, and the decisions you can make
afterward are the children of that node. A serieis of decisions is a
path from root to descendan.t}

◊todo{Sequence of stuff:
- Go through some basic linear time stuff. Like a search.
- Go through a quadratic time algorithm, like a sort or something.
- For the previous two, derive the time functions and then make some
simple appeal to the "Big O" of it. You don't have to do the precise
definition of it. A few simple rules of thumb ought to do for
understanding the concept. The precise rules are for explaining the
rules of thumb: that it's transitive, and that the "large dominates
the small" and so on.
- Go into a much larger complexity, like exponential and factorial.
- Explain that for many of these larger problems, the time complexity
is large because we're searching through a space of possibilities that
is the size of exponential or factorial, and finding our answer
requires exploring this space.
- Then show that, for problems like this, doing better means figuring
out what possibilities you can ignore.
- Show that you can implement sorting by searching through the
permutations.
- The reason sorting isn't a factorial time operation is that you
really DON'T have to look through all the permutations. You move
closer and closer to the sorted permutation at each step. You can sort
if you can just guarantee that you keep approaching a "more sorted"
result.
- Show the maximum product of 3 integers problem.
    - a 1st approach is to look through all triples. This means
    exploring the space of ◊choose{n 3}, which is cubic (it's 
    ◊${n (n-1) (n-2)}).
    - You can cut down on this approach by noticing that the largest
    number of the list must always be in the result. Thus, now you can
    go down to searching through all PAIRS of numbers, which is
    ◊choose{n 2}. This is a quadratic time operation.
    - However, you can do even a little bit better. You can notice
    further that not all pairs really contribute to the result. In the
    end, the only numbers that will matter to the product are the
    numbers at the extremes: those with the highest absolute value.
    Thus the 3 highest positive numbers and 2 least negative numbers
    (or just the 2 least numbers period) are what will matter.
    Obtaining just these numbers is a linear time operation. Then you
    can find the pairs out of these numbers that maximize the product.
    Since you're only ever looking through 5 numbers (minimum 3, if
    the array is of length 3), you're now searching through a constant
    number of pairs. Thus the final time complexity is linear +
    constant.
- Derive the time functions for these as well... or leave it as an
exercise for her. That might work, too. It's worth it to derive the
times for these different approaches. What's nice is that the maximum
product question is loops all the way. For loops, in fact. So the
number of times to iterate is straightforward.

I think that the derivation of time functions is pretty important.
More important than the precise definition of Big O. To get the
correct big O, she can just follow some rules of thumb from this
process. However, knowing the precise definition is also helpful. I'd
put it in an appendix or something.
}

◊todo{Show that constants don't matter according to the strict mathematical
definition of Big-O. Then try to give an explanation as to why that
would be desirable. Part of that is the abstract machine notion. Part
of explaing the abstract machine is showing that, on a real machine,
you'd fill in O(1) operations with an actual number-- or even a set of
different numbers, if different operations take a different amount of
time (integer and floating-point addition take a diff amount of time,
addition and multiplication/division take a different amount of time).
That would fuck with the constants on the time operation. So you'd
like a method of comparison that ignores constants. And these
constants will "bleed into" operations of any size: linear, quadratic,
and so on.
To show that big-o ignores constants, you can put in a function, then
put in a function times a constant, and show that the 2nd form is
always big-o precisely when the 1st form is big-o and vice versa.
}

◊todo{Show examples of algorithms that have different time
complexities.

- constant: arithmetic on numbers of bounded size, parity of a binary
number
- linear: max, search, array insert, addition of two numbers,
appending strings.
- logarithmic: search.
- quadratic: search, multiplication of two binary numbers.
- exponential: combinations/power sets, generating a series of n-bit
numbers, each of which differ by only 1 bit, boolean satisfiability
problem, minimax (I think?).
- factorial: enumerating permutations, hamiltonian cycle, dumbest
sorting algorithm ever. (actually it would be n * n!).

As a bonus, consider presenting one with a more "exotic" complexity,
like ◊${ log log n} or something.

Many algorithms essentially boil down to searching through a space of
possibilities. For such cases, you can easily make the worst-case time
complexity high by making the search space large. For instance, the
numbest sort algorithm does was it does by searching for the sorted
version of the array though the search space of all possible orders of
the array.
}

Appendix
========

Precise Definition of Big O
---------------------------

The partners of Big O
---------------------

Comparing the Industry and CS meaning of Big O
----------------------------------------------

It's a straightforward change. The industry meaning is CS's
◊|theta|.

