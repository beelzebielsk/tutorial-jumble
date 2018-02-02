> The tradeoff that Redux offers is to add indirection to decouple
> “what happened” from “how things change”.  Is it always a good thing
> to do? No. It’s a tradeoff.

This article has two examples for a counter. Let's compare them
side-by-side:

Normal React:

~~~
class Counter extends Component {
  state = { value: 0 };

  increment = () => {
    this.setState(prevState => ({
      value: prevState.value + 1
    }));
  };

  decrement = () => {
    this.setState(prevState => ({
      value: prevState.value - 1
    }));
  };
  
  render() {
    return (
      <div>
        {this.state.value}
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    )
  }
}
~~~

Redux-ish:

~~~
const counter = (state = { value: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { value: state.value + 1 };
    case 'DECREMENT':
      return { value: state.value - 1 };
    default:
      return state;
  }
}

class Counter extends Component {
  state = counter(undefined, {});
  
  dispatch(action) {
    this.setState(prevState => counter(prevState, action));
  }

  increment = () => {
    this.dispatch({ type: 'INCREMENT' });
  };

  decrement = () => {
    this.dispatch({ type: 'DECREMENT' });
  };
  
  render() {
    return (
      <div>
        {this.state.value}
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    )
  }
}
~~~

What exactly is the difference between these two? Why would you
perhaps choose one over the other?

Let's start with the plain, obvious differences:

- The normal react version just has two state changing methods:
  `increment` and `decrement`.
- The redux-ish version has one state changing method, and `increment`
  and `decrement` have been replaced with something else.

Okay, how do these differences relate to the quote from the article?

To be coupled means to be together. Your hand is coupled to your arm
for instance. To decouple them means to take them apart. The two
things to pay attention to are "what happened" and "how things
change".

So what can happen to our counter? It can either increase by 1, or
decrease by 1. These two events are called increment and decrement
respectively. These are the two possibilities for "what happened".

**How do those two things happen?**

- increment: the state of the component is increased by 1, by calling
  this.setState, and passing in a new object which has the appropriate
  state.
- decrement: is similar to increment. Call this.setState with a new
  object that contains the appropriate state.

In the normal React version, both the description of what happened and
the mechanics of them happening are all wrapped up in the same
function. Increment is a function, and it describes what happens:
increment. It also includes the logic for making an increment happen.
It's a similar case for decrement.

**Contrast that with the Redux-ish version:**

- There is only one function that affects state: dispatch.
- The increment and decrement functions do only one thing: describe
  what happens. They either say that an increment took place, or a
  decrement took place. But they don't explain how those work. Only
  the `counter` function explains how those work. The `counter` is the
  one central location the describes "how things change".

For one thing, this makes it really easy to build a history of an
application, no matter how complicated your state mutations are. You
can literally just keep a list of the actions that were performed:

    history = [INCREMENT, DECREMENT, INCREMENT, INCREMENT, DECREMENT]

It seems like Redux is one of the latest web applications/frameworks
to try and take advantage of the stuff you can find in advanced
functional programming (which I'm not all that familiar with).

So, this sort of stuff comes from the same programming style where
map, reduce, filter, were popular for a long time. Promises are also a
part of this push to include functional programming style into other
applications. The main focus of all of this stuff is to try and
describe a program as functions calling function.

With Redux, you can describe your application as state changes calling
state changes.

    Example: INCREMENT(DECREMENT(INCREMENT(INCREMENT(originalState))))

Well... not exactly like that. A little bit different actually. The
reason is that you're actually composing calls to `counter` (which I
belive Redux calls a *reducer*).
    
    counter(
        counter(
            counter(
                counter(
                    originalState,
                    INCREMENT
                ),
                INCREMENT
            ),
            DECREMENT
        ),
        INCREMENT
    )

But the concept is pretty much the same.

NOTE: In order for you to describe the changes to a program's state as
a composition of functions, the functions have to be *directly* aware
of the state. That means *not* accessing state using `this`. When you
access state using `this`, you're using a function to affect the world
in a way that the function isn't really aware of. You can call the
function twice and get two different final results, if the function
was called with two different states. There is no way to tell what the
final state of your program will be from within a function itself, if
you're accessing the state of your program using `this`.

SUBNOTE: That feels... untrue. `this` could just hold a global state
tree. There could be one reducer function to describe the actions
that can take place on the state tree... but this requires discipline
to adhere to, and you're left with the question of: but how did you
build the reducer? Is that a part of the state tree? Outside of it?
The part of the program where you build your reducer was necessarily
not functional. Eh. Whatever.

There's a lot of neat benefits to describing a program like that, most
of which I don't yet understand.
