const input = require("./input");

function solve(groups) {
    let maxSum = Number.NEGATIVE_INFINITY;

    for (let group of groups) {
        const sum = group.reduce((curr, acc) => curr + acc, 0);

        if (sum > maxSum) {
            maxSum = sum;
        }
    }

    return maxSum;
}

console.log(solve(input));
