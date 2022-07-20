module.exports = {
    functions: {
        "+": {
            arity: [[0,0],[0]],
            operation: (a,b) => a+b,
            help: "Adds two numbers.",
            generated: false
        },
        "-": {
            arity: [[0,0],[0]],
            operation: (a,b) => a-b,
            help: "Subtracts two numbers.",
            generated: false
        },
        "*": {
            arity: [[0,0],[0]],
            operation: (a,b) => a*b,
            help: "Multiplies two numbers.",
            generated: false
        },
        "/": {
            arity: [[0,0],[0]],
            operation: (a,b) => a/b,
            help: "Divides two numbers.",
            generated: false
        },
        "show": {
            arity: [[0],[0]],
            operation: (val) => {
                console.log(val)
            },
            generated: false
        },
        "eq": {
            arity: [[0,0],[0]],
            operation: (a,b) => {
                return a === b;
            },
            generated: false
        },
        ">": {
            arity: [[0,0],[0]],
            operation: (a,b) => {
                return a > b;
            },
            generated: false
        },
        "<": {
            arity: [[0,0],[0]],
            operation: (a,b) => {
                return a < b;
            },
            generated: false
        },

    }
}