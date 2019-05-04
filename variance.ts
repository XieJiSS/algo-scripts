import * as add from "add";
import expectation from "./expectation";

function variance(nums: number[], P?: number[]): number {
    const avg = expectation(nums, P);
    let squareErrorArr: number[] = [];
    for(let i = 0; i < nums.length; i++) {
        squareErrorArr.push((nums[i] - avg) ** 2);
    }
    return add(squareErrorArr) / nums.length;
}

export default variance;
