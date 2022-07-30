const interpreter =  require("./interpreter");
const builtin = require('./builtin');

const newVars = () => {
    return {"_functionScoped": {}};
}

const clearGlobalFunctions = () => {
    builtin.functions = Object.fromEntries(Object.entries(builtin.functions).filter(([key]) => !builtin.functions[key].generated));
}

const interpret = (line, vars) => {
    return interpreter.interpretLine(line, vars, true);
}

const tests = [
    {
        operation: () => {
            let vars = newVars();
            return interpret("8", vars)[1];
        },
        expected: 8,
        what: "Returns a number when it is provided."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("[1,2,3]", vars)[1];
        },
        expected: [1,2,3],
        what: "Returns a numeric array when provided."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("x = 3", vars)[0]['x'];
        },
        expected: 3,
        what: "Assigns a variable to an integer."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("1 + 2", vars)[1];
        },
        expected: 3,
        what: "Performs addition."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("3 * (2 + 4)", vars)[1];
        },
        expected: 18,
        what: "Respects parentheses for infix operators."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("x = 3 * (2 + 4)", vars)[0]['x'];
        },
        expected: 18,
        what: "Assigns a variable to the result of a computation."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("[1,2,3] -> @ * 2", vars)[1];
        },
        expected: [2,4,6],
        what: "Maps a mathematical function over an array."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("[1,2,3] -> @ * 2 -> @ + 5", vars)[1];
        },
        expected: [7,9,11],
        what: "Chains two mathematical functions over an array."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("[1,2,3] ~> (@ % 2) == 0", vars)[1];
        },
        expected: [2],
        what: "Filters an array for even values."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("[1,2,3] ~> (# % 2) == 0", vars)[1];
        },
        expected: [1,3],
        what: "Filters an array for elements at even indices."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("[1..5]", vars)[1];
        },
        expected: [1,2,3,4,5],
        what: "Creates a range out of two integers."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("[5..1]", vars)[1];
        },
        expected: [5,4,3,2,1],
        what: "Creates a backwards range out of two integers."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("[10..12]", vars)[1];
        },
        expected: [10,11,12],
        what: "Creates a range out of two double digit integers."
    },
    {
        operation: () => {
            let vars = newVars();
            interpret("x = 3", vars);
            return interpret("[x..5]", vars)[1];
        },
        expected: [3,4,5],
        what: "Creates a range out of a variable and integer."
    },
    {
        operation: () => {
            let vars = newVars();
            interpret("x = 3", vars);
            interpret("z = 5", vars)
            return interpret("[x..z]", vars)[1];
        },
        expected: [3,4,5],
        what: "Creates a range out of two variables."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("[1,2,3] \\> 0 $ + @", vars)[1];
        },
        expected: 6,
        what: "Sums a list using a reduce."
    },
    {
        operation: () => {
            let vars = newVars();
            return interpret("[1,2,3,4,5] -> @ * 2 ~> @ > 4 \\> 0 $ + @", vars)[1];
        },
        expected: 24,
        what: "Chains all the list operations."
    },
    {
        operation: () => {
            let vars = newVars();
            interpret("add a b = a + b", vars);
            return interpret("add 3 5", vars)[1];
        },
        expected: 8,
        what: "Defines an arithmetic function."
    },
    {
        operation: () => {
            let vars = newVars();
            interpret("square n = n * n", vars);
            interpret("cube n = n * (square n)")
            return interpret("cube 3", vars)[1];
        },
        expected: 27,
        what: "Calls one function in another."
    },
    {
        operation: () => {
            let vars = newVars();
            interpret("s 1 = 1", vars);
            interpret("s n = n + (s n - 1)", vars);
            return interpret("s 5", vars)[1];
        },
        expected: 15,
        what: "Uses pattern matching to perform a recursive sum."
    },
    {
        operation: () => {
            let vars = newVars();
            interpret("f \"a\" = true", vars);
            interpret("f x = x", vars);
            return interpret("f \"a\"", vars)[1];
        },
        expected: true,
        what: "Uses pattern matching on strings for boolean."
    },
    {
        operation: () => {
            let vars = newVars();
            interpret("f \"a\" = true", vars);
            interpret("f x = x", vars);
            return interpret("f \"hello\"", vars)[1];
        },
        expected: "hello",
        what: "Uses pattern matching on strings for string."
    },
]

const runTests = () => {
    interpreter.provideInterpreterFunctions();

    let passed = 0;

    for (const test of tests) {
        const op = test.operation();
        try {
            if (op === test.expected || interpreter.arraysMatch(op, test.expected)) {
                console.log("Test passed: " + test.what);
                passed ++;
            } else {
                console.log("\n------------------\n")
                console.log("Test failed: " + test.what);
                console.log("Expected: " + test.expected);
                console.log("Got: " + op);
            }
        } catch (error) {
            console.log("Test failed: " + test.what);
            console.log("Error: " + error);
        }
        clearGlobalFunctions();
    }

    console.log("\n------------------\n")
    console.log("Passed " + passed +"/" + tests.length + " tests.");
}

module.exports = {
    runTests
}

