const builtin = require('./builtin');

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
	let lastBr = 0;
	for (let i = 0 ; i < expression.length ; i ++ ) {
		if (expression[i] === ' ' || expression[i] === ',') {
			yield expression.slice(lastBr,i).replace(/[\])}[{(]/g, '');
			lastBr = i + 1;
		}
	}
	yield expression.slice(lastBr).replace(/[\])}[{(]/g, '');
}


const isNumeric = n => !!Number(n) || n === '0';

const functor = (gen, vars) => {
	let arg = gen.next().value;
	if (isNumeric(arg)) {
		arg = parseInt(arg);
	}
	if (arg in builtin.functions) {
		const func = builtin.functions[arg];
		const spreadables = func.arity[0].map(_ => functor(gen, vars));
		if (func.generated) {
            return func.operation(spreadables);
        }else {
            return func.operation(...spreadables);
        }
	} else if (arg in vars) {
		return vars[arg];
	} else {
		return arg
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
    return functor(gen, vars);
}

const interpretLine = (line,vars) => {
	const tokens = tokenize(line).map(token=>token.trim());
	if (isFunctionDef(tokens[0])) {
	    generateFunction(tokens[0], tokens[1], vars);
	    return vars;
    } else {
        const result = interpretExpression(tokens[1], vars);
        if (tokens[0] !== '_') {
            vars[tokens[0]] = result;
        }
        console.log(result);
        return vars;
    }
}

const interpretBlock = (text) => {
	let vars = {};
	const lines = text.split("\n");
	for (const line of lines) {
		vars = interpretLine(line,vars);
	}
}

console.log(interpretBlock("add a b = + a b\nc = add 3 2"))