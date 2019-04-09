"use strict";

// see https://leetcode.com/problems/find-pivot-index

function findPivot(arr: number[]):number {
    const sum = arr.reduce((a, b) => a + b, 0);
    let leftSum = 0;
    for(let i = 0; i < arr.length; i++) {
        if(sum - arr[i] === leftSum * 2) {
            return i;
        }
        leftSum += arr[i];
    }
    return -1;
}

export = findPivot;
