# Day 20: Grove Positioning System

You can find the puzzles [here](https://adventofcode.com/2022/day/20).

## ✍🏼 Input

A list of integers.

Example:

```js
const input = [1, 2, -3, 3, -2, 0, 4];
```

## 🧩 First puzzle

### Objective

To mix a list of integers, move each number forward or backward in the list a number of positions equal to the value of the number being moved. The list is circular, so moving a number off one end of the list wraps back around to the other end as if the ends were connected. The numbers should be moved in the order they originally appear in the list.

Mix the list of numbers and then find the sum of the 1000th, 2000th, and 3000th numbers after the value `0` in the mixed list.

### Solution

Instead of manipulating the list by inserting and removing numbers, I decided to follow a more mathematical approach by using [permutations](https://en.wikipedia.org/wiki/Permutation). I don't think it's the most efficient solution, but it's a fun way to solve the puzzle.

Basically, the mixing permutation will be initialised with the identity permutation (i. e. move each number to its original position).

Then, for each number of in the list:

1. Find the current position and the target position on the partially mixed list.
2. Generate the move permutation representing that change in positions.
3. Update the mixing permutation by composing it with the move permutation.

At the end of this process, you will end up with a permutation that describes where to move numbers in the original list to obtain the mixed list.

There are a couple of tricky parts in this process:

-   Finding the current position of a number if the partially mixed list is easy, we just need to apply the mixing permutation to the original position of the number in the list. However, finding the target position is a bit more tricky, because if we simply add the number of the current position, we can obtain a big number or even a negative one, and this is not ideal because we want a position between `0` and `n - 1`, with `n` being the length of the input list. To achieve that we need two tricks:
    -   Apply modulo `n - 1` to the number; this might seem a bit strange, because then the result will be between `0` and `n - 2`, but this actually makes sense. Since the list is circular, positions `0` and `n - 1` are equivalent, so there's only `n - 2` real choices.
    -   Use a [trick](https://stackoverflow.com/a/4467559) to ensure the result of the modulo operation is positive.
-   Generating the move permutation might be a bit hard to follow, but it can easily be seen with an example.

    Suppose you start with the identity permutation `[0,1,2,3,4]`.

    -   If we want to move position `1` to position `4`, we will end up with `[0,2,3,4,1]`.
    -   If we want to move position `4` to position `1` , we will end up with `[0,4,1,2,3]`.

    Following these examples, it's easy to produce some code that generates the move permutation.

```js
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
```

## 🧩 Second puzzle

### Objective

Same objective as before, but this time:

-   Multiply the numbers in the original list by `811589153`.
-   Mix the file `10` times.

### Solution

Same solution as before.

```js
const input = require("./input");

const DECRYPTION_KEY = 811589153;
const NUMBER_OF_MIXES = 10;

function solve(nums) {
    const n = nums.length;

    for (let i = 0; i < n; i++) {
        nums[i] *= DECRYPTION_KEY;
    }

    let permutation = Array.from({ length: n }, (_, i) => i);

    for (let i = 0; i < NUMBER_OF_MIXES; i++) {
        nums.forEach((num, numOriginalPos) => {
            const numPos = permutation[numOriginalPos];
            const numNewPos = getPositiveMod(numPos + num, n - 1);

            const movePermutation = getMovePermutation(n, numPos, numNewPos);

            permutation = composePermutations(n, permutation, movePermutation);
        });
    }

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
```
