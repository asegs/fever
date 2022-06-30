const tokenize = (line) => {
	for (let i = 0 ; i < line.length ; i ++ ) {
		//Ignore and exclude spaces.
		if (line[i] === '=') {
			return [line.slice(0,i), line.slice(i + 1)]
		}
	}
	return ["_",line]
}

const functions = {
	add: {
		arity: [[0,0],[0]],
		operation: (a,b) => a+b,
		help: "Adds two numbers."
	}
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
	if (arg in functions) {
		const func = functions[arg];
		const spreadables = func.arity[0].map(_ => functor(gen, vars));
		return func.operation(...spreadables);
	} else if (arg in vars) {
		return vars[arg];
	} else {
		return arg
	}
}

const interpretLine = (line,vars) => {
	const tokens = tokenize(line);
	const gen = argGenerator(tokens[1])
	const result = functor(gen,vars);
	if (tokens[0] !== '_') {
		vars[tokens[0]] = result;
	}
	console.log(result);
	return vars;
}

const interpretBlock = (text) => {
	let vars = {};
	const lines = text.split("\n");
	for (const line of lines) {
		vars = interpretLine(line,vars);
	}
}
