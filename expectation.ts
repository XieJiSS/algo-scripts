import * as add from "add"

function expectation(X: number[], P?: number[]): number {
    if(!P) {
        P = Array.from(new Array(X.length), () => 1 / X.length);
    }
    if(P.length !== X.length) {
        throw new RangeError("If specified, P.length should equal to X.length");
    }
    let expecArr: number[] = [];
    for (let i = 0; i < X.length; i++) {
        expecArr.push(X[i] * P[i]);
    }
    const expec: number = add(expecArr);
    return expec;
}

export = expectation;
