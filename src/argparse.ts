class ArgExtractor {
    argsStr: string;
    index: number;

    constructor(argsStr: string) {
        this.argsStr = argsStr;
        this.index = 0;
        this.skipWhitespace();
    }

    isEos(): boolean {
        const result = this.index >= this.argsStr.length;
        return result;
    }

    private isWhitespace(ch: string) {
        const result = /\s/g.test(ch);
        return result;
    }

    private consumeChar(): void {
        this.index++;
    }

    private peekChar(): string {
        return this.argsStr[this.index];
    }

    private nextChar(): string {
        return this.argsStr[this.index++];
    }

    private skipWhitespace(): void {
        let char = this.peekChar();
        while (this.index < this.argsStr.length && this.isWhitespace(char)) {
            this.consumeChar();
            char = this.peekChar();
        }
    }

    next(): string {
        let arg = '';
        let inQuotedString = false;

        const handleWhitespace = (char: string): boolean => {
            if (inQuotedString) {
                arg = arg.concat(char);
                return false;
            } else {
                this.skipWhitespace();
                return true;
            }
        };

        const handleDoubleQuote = () => {
            if (inQuotedString) {
                const peek = this.peekChar();
                if (peek == '"') {
                    // literal quote
                    this.consumeChar();
                    arg = arg.concat(peek);
                } else {
                    // end of quotation; just consume character without adding literally to arg
                    inQuotedString = false;                    
                }
            } else {
                // open double quotation
                inQuotedString = true;
            }
        };

        while (!this.isEos()) {
            const char = this.nextChar();
            if (this.isWhitespace(char)) {
                if (handleWhitespace(char)) {
                    break;
                }
            } else if (char == '"') {
                handleDoubleQuote();
            } else {
                // some other character other than whitespace or quotes or escape character; include in arg and continue
                arg = arg.concat(char);
            }
        }
        return arg;
    }
}

export function parseArgs(argsStr: string): string[] {
    const extractor = new ArgExtractor(argsStr);
    const result = [];
    while (!extractor.isEos()) {
        const arg = extractor.next();
        result.push(arg);
    }
    return result;
}
