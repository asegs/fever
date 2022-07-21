const operators = ['+','-','*','/'];
const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
}
const top = (stack) => {
    return stack[stack.length - 1];
}

const prec = (token) => {
    if (token in precedence) {
        return precedence[token];
    }
    return 0;
}

const semanticSymbols = [' ',',','[',']','<','>'];

const isOperand = (c) => {
    return ('a' <= c && c <= 'z') ||
        ('0' <= c && c <= '9') ||
        ('A' <= c && c <= 'Z') ||
        semanticSymbols.includes(c);
}

const minusIsArrow = (infix, index) => {
    return index + 1 < infix.length && infix[index] === '-' && infix[index + 1] === '>';
}

const infixToPrefix = (infix) => {
    let encounteredOperator = true;
    const operandStack = [];
    const operatorStack = [];
    for (let i = 0 ; i < infix.length ; i ++ ) {
        const token = infix[i];
        if (isOperand(token) || minusIsArrow(infix, i)) {
            if (encounteredOperator) {
                operandStack.push(token);
            } else {
                operandStack[operandStack.length - 1] += token;
            }
            encounteredOperator = false;
        } else if (token === '(' || operatorStack.length === 0 || prec(token) > prec(top(operatorStack))) {
            operatorStack.push(token);
            encounteredOperator = true;
        } else if (token === ')') {
            while (top(operatorStack) !== '(') {
                const operator = operatorStack.pop();
                const right = operandStack.pop();
                const left = operandStack.pop();
                operandStack.push(operator+ " "  + left + " " + right);
            }
            encounteredOperator = true;
            //operatorStack.pop();
        } else if (prec(token) <= prec(top(operatorStack))) {
            while (operatorStack.length > 0 && prec(token) <= prec(top(operatorStack))) {
                const operator = operatorStack.pop();
                const right = operandStack.pop();
                const left = operandStack.pop();
                operandStack.push(operator+ " "  + left + " " + right);
            }
            operatorStack.push(token);
            encounteredOperator = true;
        }
    }
    while (operatorStack.length > 0) {
        const operator = operatorStack.pop();
        const right = operandStack.pop();
        const left = operandStack.pop();
        operandStack.push(operator + " " + left + " "  + right);
    }
    return operandStack.join("").replace(/[)}{(]/g, '');
}

//Causing trouble
//fib n = fib (n-1) + fib (n-2)

module.exports = {infixToPrefix}