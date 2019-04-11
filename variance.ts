import * as add from "add"

function variance(nums: number[]): number {
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    let squareErrorArr: number[] = [];
    for(let i = 0; i < nums.length; i++) {
        squareErrorArr.push((nums[i] - avg) ** 2);
    }
    return add(squareErrorArr) / nums.length;
}

export = variance;
