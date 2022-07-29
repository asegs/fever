# Fever: A Guide

## How to run?
Currently, Fever can be run only in interactive mode by running `node interpreter/interactive.js`.

## The basics
Fever is a loosely functional, point free programming language with a lot of bugs.

The very basic core features include pattern matching, recursion, maps, reduces, filters, and very casual vectorization.

### Here is some example Fever arithmetic.

``` js
x = 3  // 3
y = 5 // 5
z = x + y // 8

5 == 5 // true
4 == 5 // false

4 < 5 // true
4 > 5 // false
    
4 * (3 + 2) // 20
5 % 3 // 2

```

### Here is some simple logic.

If statements are simply implemented as ternary operators which return a value, and with pattern matching.
```js
? true "Expected" "Weird" // Expected
? 3 == 3 "Expected" "Weird" // Expected
? len [1,2,3] == 3 "Expected" "Weird" // Expected
```

Expressions will just evaluate in place, so if you just need true/false, you can just use:
```js
x = 3 == 3 // true
5 == 4 // false
```
These work in list functions as well.

### Here are some list manipulations, from basic to crazy!

#### Concatenation and ranges:
```js
x = [1,2,3] // [1,2,3]
y = [4,5,6] // [4,5,6]
z = x + y // [1,2,3,4,5,6]

a = [1..5] // [1,2,3,4,5]
b = [5..1] // [5,4,3,2,1]

start = 3 // 3
end = 10 // 10
range = [start..end] // 3,4,5,6,7,8,9,10
```

### Transforms

#### Maps!

Maps over lists are implicit in Fever, and are accessed using the `->` syntax on a list.

From here, you will have a function that can use some data about the map:
* `@` - the current list item's value.
* `#` - the current list item's index.
* `^` - the original list, whole.

```js
[1,2,3] -> @ + 3 // [4,5,6]

[1..10] -> ? # % 2 == 0 @ "Odd" // [Odd, 2, Odd, 4, Odd ... 10]
```

Maps can be chained as well (and with other list operators!)

```js
[1..5] -> @ * 3 -> @ + 5 // [8,11,14,17,20]
```

#### Reduces!

Reduces over lists are implicit in Fever, and are very similar to maps, but with an accumulator.

They can be accessed using the "drop down" operator, or `\>`.

You can use the same hotkeys as in maps, and use `$` to reference the accumulator.

Reduces take a starting value first, and a function to set the accumulator to every iteration second.

Here, we are going to sum a list.
```js
//0 is the initial accumulator value, $ + @ is the function.
//For each iteration, $ is set equal to itself plus the current value in the list.
[1,2,3] \> 0 $ + @ // 6
```

#### Filters!

Filters only keep the elements from a list that match a condition and are implicit as well.

They are accessed with the dubious arrow operator, or `~>`.

Here, we are going to filter a list down to values that are larger than 5.

```js
[1..10] ~> @ > 5 // [6,7,8,9,10]
```

Here, we are going to filter a list down to even values.

```js
[1..10] ~> (@ % 2) == 0 // [2,4,6,8,10]
```

### Functions

Currently, functions in Fever has some pretty strict rules.  They can't be multiple lines, and they don't have scopes (can't declare a variable in one)

However, they can also do some cool things.

#### Simple arithmetic functions

Functions are defined like this:

```js
add a b = a + b
add 2 2 // 4
```

Functions can reference each other:

```js
square n = n * n
square 3 // 3

cube n = n * (square n)
cube 3 // 27
```

And be used in transforms:

```js
[1,2,3] -> square @ // [1,4,9]

equals_three a = a == 3
equals_three 1 // false
equals_three 3 // true

[1,2,3,3,2,1] ~> equals_three @ // [3,3]
```

#### Pattern matching

Functions in Fever use pattern matching.  You can define what a function does when you give it different specific things.

For example:
```js
greet "friend" = "HELLO!"
greet other = other + "!"

greet "friend" //"HELLO!"
greet "Johnny" //Johhny!

//Factorial, !, for example 5 factorial = 5 * 4 * 3 * 2 * 1 = 120.
//Notice that fac calls itself recursively until it is called with 1.
fac 1 = 1
fac n = n * fac (n-1) 

fac 3 // 6, 3 * (fac 2), or 3 * 2 * (fac 1), or 3 * 2 * 1.
```

Functions in Fever are always memoized unless told otherwise.

This means that it will only ever calculate the value of a function with a certain set of arguments once.

This makes things like the Fibonacci sequence wicked fast.

Speaking of which...
```js
fib 0 = 0
fib 1 = 1
fib n = (fib (n-1)) + (fib (n-2))

fib 1 // 1
fib 2 // 1, (fib 1) + (fib 0), or 1 + 0

fib 3 // 2, (fib 2) + (fib 1), or 1 + 1 (remember, we don't have to recalculate, it's memoized!)
```

If you have a function which is impure (has side effects, or depends on changing state), you can prepend it with `@i_`.

For example:
```js
@i_time_plus_n_minutes n = ...
```
but you only need to do this in the first definition, and can call it with:
```js
time_plus_n_minutes 10 // no flag!
```

## DIY

#### Builtins
You can add prefix JavaScript functions in the `builtin.js` file.

These need arity (number of arguments in, and out), an operation, and a generated tag of false.

The numbers in the arity arrays represent the dimension of the argument, 0 is one variable, 1 is a list, 2 is a 2D list, and so on.

#### Stdlib
You can add standard library functions to `std.js` in the `fevers` list.

These are defined in Fever and are added to the function scope at runtime.

#### Hairy bits
* You can't have spaces in strings or array literals.  This will change.
* You can't have any sort of function calls (even math) in array ranges.  This will change.
* You can't have multi-line procedures.  This might change...
* Order of operations is not a thing, thanks to Armand :)

* When in doubt, use parentheses! 