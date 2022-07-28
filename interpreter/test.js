const interpreter = require("./interpreter");
const assert = require("assert").strict;

const newVars = () => {
    return {"_functionScoped": {}};
}

const tests = [
    {
        operation: () => {
            let vars = newVars();
            return interpreter.interpretLine("8", vars)[1]
        },
        expected: 8,
        what: "Returns a number when it is provided."
    }
]

interpreter.provideInterpreterFunctions();

for (const test of tests) {
    assert(test.operation() === test.expected, test.what);
    console.log("Test passed: " + test.what);
}