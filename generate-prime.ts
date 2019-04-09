"use strict";

// see https://leetcode.com/problems/count-primes

function generatePrime(max: number): number[] {
    let num = 0;
    const prime: number[] = [];
    const isNotPrime: Uint8Array = new Uint8Array(max + 1);
    for(let i = 2; i <= max; i++) {
        if(isNotPrime[i] !== 1) {
            prime[num ++] = i;
        }
        for(let j = 0; j < num && i * prime[j] <= max; j++) {
            console.log(i * prime[j]);
            isNotPrime[i * prime[j]] = 1;
            if(i % prime[j] === 0) {
                break;
            }
        }
    }
    return prime;
}

export = generatePrime;
