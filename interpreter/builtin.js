module.exports = {
    functions: {
        "+": {
            arity: [[0,0],[0]],
            operation: (a,b) => {
                if (Array.isArray(a) || Array.isArray((b))) {
                    const x = Array.isArray(a) ? a : [a];
                    const y = Array.isArray(b) ? b : [b];
                    return x.concat(y);
                }
                return a + b;
            },
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
        "==": {
            arity: [[0,0],[0]],
            operation: (a,b) => {
                return a == b;
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
        "push": {
            arity: [[1,0],[0]],
            operation: (arr, v) => {
                arr.push(v);
            },
            generated: false
        },
        "pop": {
            arity: [[1], [0]],
            operation: (arr) => {
                return arr.pop();
            },
            generated: false
        },
        "arr": {
            arity: [[0, 0],[1]],
            operation: (n, def) => {
                let a = new Array(n);
                for (let i = 0 ; i < n ; i ++ ) {
                    a[i] = def;
                }
                return a;
            },
            generated: false
        },
        "%": {
            arity: [[0,0],[0]],
            operation: (a,b) => a%b,
            generated: false
        },
        "random": {
            arity: [[],[0]],
            operation: () => Math.random(),
            generated: false,
            memoize: false
        },
        "floor": {
            arity: [[0],[0]],
            operation: (n) => Math.floor(n),
            generated: false
        }
    }
}