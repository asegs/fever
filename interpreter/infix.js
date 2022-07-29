function infixToPrefix(sequence) {
    const output = []
    const operatorStack = []
    const reorderStack = []
    let consecutiveNonOperators = 0
    let reordering = false;
    let i = 0

    const isOperator = (c) => {
        return operators.includes(c);
    }

    const operators = ['+','-','*','/', '==','<','>','%'];

    const isArrow = (ctx, idx) => {
        return ctx.length -1 > idx && ((ctx[idx] === "-" || ctx[idx] === "\\" || ctx[idx] === "~") && ctx[idx + 1] === ">");
    }

    const isEq = (ctx, idx) => {
        return ctx.length -1 > idx && (ctx[idx] === "=" && ctx[idx + 1] === "=");
    }

    const wasArrow = (ctx, idx) => {
        return ctx.length > idx && idx > 0 && ((ctx[idx - 1] === "-" || ctx[idx - 1] === "\\" || ctx[idx - 1] === "~") && ctx[idx] === ">");
    }

    const addSpacesToken = (ctx, idx, offset) => {
        let builder = "";
        if (idx > 0 && ctx[idx - 1] !== " ") {
            builder += " ";
        }
        builder += ctx.slice(idx,idx+offset + 1);
        if (idx + offset + 1 < ctx.length && ctx[idx + 1 + offset] !== " ") {
            builder += " ";
        }
        return builder;
    }

    const addSpaces = (seq) => {
        let finished = false;
        while (!finished) {
            let broke = false;
            for (let i = 0 ; i < seq.length ; i ++) {
                const char = seq[i];
                let reassigned = false;
                if (["+","*","/","<","%"].includes(char)) {
                    const token = addSpacesToken(seq,i,0);
                    seq = seq.slice(0,i) + token + seq.slice(i + 1);
                    if (token.length > 1) {
                        reassigned = true;
                    }
                } else if (isArrow(seq, i)){
                    const token = addSpacesToken(seq,i,1);
                    seq = seq.slice(0,i) + token + seq.slice(i + 2);
                    if (token.length > 2) {
                        reassigned = true;
                    }
                } else  if (isEq(seq, i)) {
                    const token = addSpacesToken(seq,i,1);
                    seq = seq.slice(0,i) + token + seq.slice(i + 2);
                    if (token.length > 2) {
                        reassigned = true;
                    }
                } else if (char === "-" || (char === ">" && !wasArrow(seq,i))){
                    const token = addSpacesToken(seq,i,0);
                    seq = seq.slice(0,i) + token + seq.slice(i + 1);
                    if (token.length > 1) {
                        reassigned = true;
                    }
                }
                if (reassigned) {
                    broke = true;
                    break;
                }
            }
            if (!broke) {
                finished = true;
            }
        }
        return seq;
    }

    const parenSplit = (seq) => {
        const blocks = [];
        let parenCount = 0;
        let lastBlockEnd = 0;
        let blockStart = 0;
        for (let  i = 0 ; i < seq.length ; i ++) {
            const char = seq[i];
            if (char === '(') {
                parenCount ++;
                if (parenCount === 1) {
                    blockStart = i + 1;
                    if (i > 0) {
                        blocks.push({
                            text: seq.slice(seq[lastBlockEnd] === ')' ? lastBlockEnd + 1 : lastBlockEnd, i),
                            paren: false
                        })
                    }
                }
            } else if (char === ")") {
                parenCount --;
                lastBlockEnd = i;
                if (parenCount === 0) {
                    blocks.push({
                        text: seq.slice(blockStart, i),
                        paren: true
                    })
                }
            }
        }
        if (lastBlockEnd < seq.length - 1 || seq.length === 1) {
            blocks.push({
                text: seq.slice(seq[lastBlockEnd] === ')' ? lastBlockEnd + 1 : lastBlockEnd, seq.length),
                paren: false
            })
        }
        return blocks;
    }

    const tokenize = (seq) => {
        return parenSplit(addSpaces(seq)).flatMap(token => {
            if (token.paren) {
                return [token];
            }
            return token.text.split(" ").map(v => {
                return {text: v, paren: false}
            })
        }).filter(t => t.text.length > 0);
    }

    if (sequence.startsWith("import")) {
        return sequence;
    }

    for (let expr of tokenize(sequence)) {
        if (isOperator(expr.text)) {
            if (!reordering) {
                // Take off the last thing we pushed to output
                reorderStack.push(output.pop())
            }

            reordering = true;
            consecutiveNonOperators = 0;

            // Push an operator onto the stack
            operatorStack.push(expr)
        } else {
            if (reordering) {
                // If true, we just dealt with an operator.
                // Push an additional item onto the reorder stack
                // and go to the next token
                reorderStack.push(expr)
                consecutiveNonOperators++;
                if (consecutiveNonOperators === 2) {
                    reordering = false;
                    consecutiveNonOperators = 0;

                    // If there are pending reorders, drain the reorder stacks
                    while (operatorStack.length > 0) {
                        output.push(operatorStack.pop())
                    }

                    output.push(...reorderStack)

                    reorderStack.splice(0, reorderStack.length)
                }
            } else {
                // push current value to output
                output.push(expr)
            }
        }

        i++;
    }

    // ensure reorder stacks are empty before exiting the procedure
    while (operatorStack.length > 0) {
        output.push(operatorStack.pop())
    }

    output.push(...reorderStack)
    return output.map(o => {
        if (o.paren) {
            return infixToPrefix(o.text);
        }
        return o.text;
    }).join(" ");
}

module.exports = {infixToPrefix}