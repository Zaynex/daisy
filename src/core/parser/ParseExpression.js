import parse from '../../../lib/jsep';

let EXPR_OPEN_BOUNDS = '{{';
let EXPR_CLOSE_BOUNDS = '}}';

function ParseExpression(source) {
    return parse(source);
}

function isStartsWithExprOpenBounds(source, pos) {
    return source.startsWith(EXPR_OPEN_BOUNDS, pos);
}

function splitExpressionContent(source, startsPos) {
    const exprCloseBoundsIndex = source.indexOf(EXPR_CLOSE_BOUNDS, startsPos);
    const content = '(' + source.substring(startsPos + EXPR_OPEN_BOUNDS.length, exprCloseBoundsIndex) + ')';

    return {
        content,
        pos: exprCloseBoundsIndex + EXPR_CLOSE_BOUNDS.length
    };
}

function splitStringContent(source, startsPos) {
    let stringEndIndex = source.indexOf(EXPR_OPEN_BOUNDS, startsPos);
    if (!~stringEndIndex) {
        stringEndIndex = source.length;
    }
    let content = source.substring(startsPos, stringEndIndex);
    if (content) {
        content = '"' + content + '"';
    }
    return {
        content,
        pos: stringEndIndex
    };
}

// {
export function isOpenExpr(letter = '', nextLetter = '') {
    return [letter, nextLetter].join('').indexOf(EXPR_OPEN_BOUNDS) === 0;
}

// }
export function isCloseExpr(letter = '', nextLetter = '') {
    return [letter, nextLetter].join('').indexOf(EXPR_CLOSE_BOUNDS) === 0;
}

// includes {{ }}
export function isIncludeExpr(words = '') {
    return words.includes(EXPR_OPEN_BOUNDS) && words.includes(EXPR_CLOSE_BOUNDS);
}

export function getExpressionBounds() {
    return {
        open: EXPR_OPEN_BOUNDS,
        close: EXPR_CLOSE_BOUNDS
    };
}

export function setExpressionBounds({
    open,
    close
}) {
    EXPR_OPEN_BOUNDS = open;
    EXPR_CLOSE_BOUNDS = close;
}


export function Expression(source = '') {
    if (isIncludeExpr(source)) {
        let stack = [];
        let i = 0;
        while (i < source.length) {
            const {
                content,
                pos
            } = isStartsWithExprOpenBounds(source, i) ? splitExpressionContent(source, i) : splitStringContent(source, i);
            if (content)
                stack.push(content);
            i = pos;
        }
        return ParseExpression(stack.join('+'));
    } else {
        return ParseExpression(source);
    }
}