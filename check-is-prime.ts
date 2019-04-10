// see https://www.luogu.org/problemnew/solution/P3383

function checkIsPrime(num: number): boolean {
    if(num < 5) {
        return num === 2 || num === 3;
    }
    const rem6 = num % 6;
    if(rem6 !== 5 && rem6 !== 1) {
        return false;
    }
    const sqroot = ~~ Math.sqrt(num);
    for(let i = 5; i <= sqroot; i += 2) {
        if(num % i === 0)
            return false;
    }
    return true;
}

export = checkIsPrime;
