class Iterator {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = -1;
    }

    peek() {
        return this.tokens[this.index + 1];
    }

    peekBack() {
        return this.tokens[this.index - 1];
    }

    next() {
        return this.tokens[++this.index];
    }

    atBeginning() {
        return this.index === 0;
    }

    atEnd() {
        return this.index === this.tokens.length - 1;
    }

}

module.exports = {Iterator}