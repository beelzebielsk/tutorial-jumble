var x = 1
/* inScope1 is created with the global environment as its
 * environment. At the time of the creation of inScope1, `x` is in the
 * global environment with value `1`, so inScope1 will return `1`.
 */
var inScope1 = () => x;
console.log(inScope1()); // 1

/* Functions create their own scopes as well. All functions do, not
 * just this one. I'm going to use this function to create a scope,
 * and then create a new function while inside of this function scope.
 */
let scopeCreator = () => {
    let x = 2;
    return () => x;
}
let inScope2 = scopeCreator();

console.log(inScope1()); // 1
console.log(inScope2()); // 2
x = 2;
console.log(inScope1()); // 2
console.log(inScope2()); // 2
x = 3
console.log(inScope1()); // 3
console.log(inScope2()); // 2

/* Closures are not something fancy that only happens once in a while.
 * Closures are how all values in a function which are not `this` and
 * are not the function's parameters get their values. When a function
 * is created, it gets a reference to the current environment in which
 * it was created. Every time the function is executed, names will be
 * checked against the function parameters, or that scope.
 */
