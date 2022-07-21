
const builtin = require('./builtin');
const converter = require('./infix');
const fs = require('fs')

const tokenize = (line) => {
	for (let i = 0 ; i < line.length ; i ++ ) {
		//Ignore and exclude spaces.
		if (line[i] === '=') {
			return [line.slice(0,i), line.slice(i + 1)]
		}
	}
	return ["_",line]
}

function* argGenerator (expression) {
    const chunks = expression.split(" ").filter(c => c !== "");
    for (let i = 0 ; i < chunks.length ; i ++ ) {
        yield chunks[i].replace(/[)}{(]/g, '');
    }
}


const isNumeric = n => !!Number(n) || n === '0';
const isArray = data => {
    return data[0] === '[' && data[data.length - 1] === ']';
}
const isString = data => {
    return data[0] === '"' && data[data.length - 1] === '"';
}

const peeker = iterator => {
    let peeked = iterator.next();
    let rebuiltIterator = function*() {
        if(peeked.done)
            return;
        yield peeked.value;
        yield* iterator;
    }
    return { peeked, rebuiltIterator };
}

const functor = (gen, vars) => {
	let arg = gen.next().value;
    arg = parseToForm(arg);
	if (arg in builtin.functions) {
		const func = builtin.functions[arg];
		const spreadables = func.arity[0].map(_ => {
            const result = functor(gen, vars);
            gen = result[0];
            return result[1];
        });
		if (func.generated) {
            return [gen, func.operation(spreadables)];
        }else {
            return [gen, func.operation(...spreadables)];
        }
	} else if (arg in interpreterFunctions){
	    const func = interpreterFunctions[arg];
        const spreadables = func.arity[0].map(_ => {
            const result = functor(gen, vars)[1];
            gen = result[0];
            return result[1];
        });
        let rebuilt = "";
        for (const a of gen) {
            rebuilt += " " + a;
        }
        rebuilt = rebuilt.trim();
        return [gen, func.operation(...spreadables, rebuilt, vars)];
    } else {
        if (arg in vars) {
            arg = vars[arg];
        }
        const peeked = peeker(gen);
        if (peeked.peeked.value === "->") {
            const toApply = gen.next().value;
            let rebuilt = "";
            for (const a of gen) {
                rebuilt += " " + a;
            }
            let result;
            if (!Array.isArray(arg)) {
                result = interpretExpression(toApply + " " + arg + " " + rebuilt, vars);
            } else {
                result = arg.map(item => {
                    return interpretExpression(toApply + " " + item + " " + rebuilt, vars)
                })
            }
            return [peeked.rebuiltIterator(), result]
        }
		return [peeked.rebuiltIterator(), arg];
	}
}

const isFunctionDef = (token) => {
    return token.includes(" ");
}

const generateFunction = (token, action, vars) => {
    const assignArgs = token.split(" ");
    const funcName = assignArgs[0];
    const args = assignArgs.slice(1);

    builtin.functions[funcName] = {
         arity: [args.map(_=>0),[0]],
         operation: (supplied) => {
             const suppliedMap = {};
             for (let i = 0 ; i < args.length ; i ++ ) {
                 suppliedMap[args[i]] = supplied[i];
             }
             return interpretExpression(action, {...vars, ...suppliedMap});
         },
         generated: true
     }
}

const interpretExpression = (expr, vars) => {
    const gen = argGenerator(expr, vars);
    return functor(gen, vars)[1];
}

const interpretLine = (line,vars) => {
	const tokens = tokenize(line).map(token=>token.trim());
    const converted = converter.infixToPrefix(tokens[1]);
    if (isFunctionDef(tokens[0])) {
	    generateFunction(tokens[0], converted, vars);
        return vars;
    } else {
        const result = interpretExpression(converted, vars);
        if (tokens[0] !== '_') {
            vars[tokens[0]] = result;
        }
        return vars;
    }
}

const interpretBlock = (text) => {
	let vars = {};
	const lines = text.split("\n");
	for (const line of lines) {
		if (!lineIsComment(line) && line.length > 0) {
            vars = interpretLine(line,vars);
        }
	}
	return vars
}

const lineIsComment = (line) => {
    return line[0] === '/';
}

const interpretFile = (filename) => {
    const data = fs.readFileSync(filename, 'utf8');
    return interpretBlock(data);
}

const interpreterFunctions = {
    "if": {
        arity: [[0],[0]],
        operation: (test, remainder, vars) => {
            if (test) {
                interpretExpression(remainder, vars)
            }
        },
        generated: false
    }
}

//Doesn't support nested arrays.
const parseToForm = (data) => {
    if (isString(data)) {
        return data.slice(1,data.length - 1);
    } else if (isNumeric(data)) {
        return parseInt(data);
    } else if (isArray(data)) {
        const members = data.slice(1,data.length - 1).split(",").filter(m => m !== " " || m !== "");
        return members.map(m => parseToForm(m));
    }
    return data
}

interpretFile("code.fv");