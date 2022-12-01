# Day 1: Calorie Counting

You can find the puzzles [here](https://adventofcode.com/2022/day/1).

## ✍🏼 Input

A list containing groups of positive integers

Example:

```js
const input = [
	[1000, 2000, 3000],
	[4000],
	[5000, 6000],
	[7000, 8000, 9000],
	[10000],
];
```

## 🧩 First puzzle

### Objective

Find the group whose elements have the biggest sum and calculate that sum.

### Solution

Straight-forward solution, nothing interesting to add.

```js
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
```

## 🧩 Second puzzle

### Objective

Find the top three groups whose elements have the biggest sum and calculate the sum of their sums.

### Solution

If you don't care about performance, you can generate a list containing the sum of each group, sort it and then get the first three elements. However, given a list of size `n`, this would take `O(nlogn)` steps due to the sorting of the array. It's more efficient to do one pass and keep track of the top three sums, as this takes `O(n)` steps.

```js
const input = require("./input");

function solve(groups) {
	let max1 = Number.NEGATIVE_INFINITY;
	let max2 = Number.NEGATIVE_INFINITY;
	let max3 = Number.NEGATIVE_INFINITY;

	for (let group of groups) {
		const sum = group.reduce((curr, acc) => curr + acc, 0);

		if (sum > max1) {
			[max1, max2, max3] = [sum, max1, max2];
		} else if (sum > max2) {
			[max1, max2, max3] = [max1, sum, max2];
		} else if (sum > max3) {
			[max1, max2, max3] = [max1, max2, sum];
		}
	}

	return max1 + max2 + max3;
}

console.log(solve(input));
```
