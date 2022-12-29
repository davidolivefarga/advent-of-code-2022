const input = require("./input");

function solve(nums) {
    const n = nums.length;

    let permutation = Array.from({ length: n }, (_, i) => i);

    nums.forEach((num, numOriginalPos) => {
        const numPos = permutation[numOriginalPos];
        const numNewPos = getPositiveMod(numPos + num, n - 1);

        const movePermutation = getMovePermutation(n, numPos, numNewPos);

        permutation = composePermutations(n, permutation, movePermutation);
    });

    const mixedNums = [];

    for (let i = 0; i < n; i++) {
        mixedNums[permutation[i]] = nums[i];
    }

    const zeroPosition = mixedNums.findIndex((num) => num === 0);

    return [1000, 2000, 3000].reduce((result, num) => {
        const coordinatePos = (zeroPosition + num) % n;
        const coordinate = mixedNums[coordinatePos];

        return result + coordinate;
    }, 0);
}

function getPositiveMod(num, mod) {
    return ((num % mod) + mod) % mod;
}

function getMovePermutation(n, pos, newPos) {
    const permutation = Array.from({ length: n }, (_, i) => i);

    permutation[pos] = newPos;

    if (pos < newPos) {
        for (let i = pos + 1; i <= newPos; i++) {
            permutation[i] = i - 1;
        }
    } else {
        for (let i = pos - 1; i >= newPos; i--) {
            permutation[i] = i + 1;
        }
    }

    return permutation;
}

function composePermutations(n, permutation1, permutation2) {
    return Array.from({ length: n }, (_, i) => permutation2[permutation1[i]]);
}

console.log(solve(input));
