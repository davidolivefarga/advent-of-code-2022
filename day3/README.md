# Day 3: Rucksack Reorganization

You can find the puzzles [here](https://adventofcode.com/2022/day/3).

## ✍🏼 Input

A list of alphabetical strings representing rucksacks.

Each character represents an item inside that rucksack.

Example:

```js
const input = [
    "vJrwpWtwJgWrhcsFMMfFFhFp",
    "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
    "PmmdzqPrVvPwwTWBwg",
    "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
    "ttgJtRGJQctTZtZT",
    "CrZsJsPPZsGzwwsLwLmpwMDw",
];
```

## 🧩 First puzzle

### Objective

Each rucksack has two comparments inside: the first half and the second half.

For each rucksack, it is guaranteed that there's exactly one item type that appears in both compartments.

The priority associated to each item type can be computed as follows:

-   Lowercase item types `a` through `z` have priorities 1 through 26
-   Uppercase item types `A` through `Z` have priorities 27 through 52

For each rucksack, calculate the priority associated to the item type that appears in both compartments.

Calculate the sum of these priorities.

### Solution

Straight-forward solution.

The only thing worth mentioning is that for this puzzle I chose readability over performance. For example, there's no need to create new strings for `firstContainer` or `secondContainer`, you can read the characters directly from `rucksack`. I tried implementing this and other small improvements and I didn't see a big impact on performance that would justify a worse readability, at least for the puzzle input... So I sticked to the readable version.

```js
const input = require("./input");

function solve(rucksacks) {
    return rucksacks.reduce((totalPriority, rucksack) => {
        const firstContainer = rucksack.slice(0, rucksack.length / 2);
        const secondContainer = rucksack.slice(rucksack.length / 2);

        const firstContainerItems = new Set(firstContainer);

        for (const item of secondContainer) {
            if (firstContainerItems.has(item)) {
                if (item === item.toLowerCase()) {
                    return totalPriority + item.charCodeAt(0) - 96;
                } else {
                    return totalPriority + item.charCodeAt(0) - 38;
                }
            }
        }
    }, 0);
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Following the list order, group the rucksacks in groups of 3.

For each group of rucksacks, it is guaranteed that there's exactly one item type that appears in all rucksacks.

The calculation of the priority associated to each item remains the same.

For each group of rucksacks, calculate the priority associated to the item type that appears in all rucksacks.

Calculate the sum of these priorities.

### Solution

Again, straight-forward solution that prioritises readability over performance.

```js
const input = require("./input");

function solve(rucksacks) {
    let totalPriority = 0;

    for (let i = 0; i < rucksacks.length; i += 3) {
        const firstRucksackItems = new Set(rucksacks[i]);
        const secondRucksackItems = new Set(rucksacks[i + 1]);

        const thirdRucksack = rucksacks[i + 2];

        for (const item of thirdRucksack) {
            if (firstRucksackItems.has(item) && secondRucksackItems.has(item)) {
                if (item === item.toLowerCase()) {
                    totalPriority += item.charCodeAt(0) - 96;
                } else {
                    totalPriority += item.charCodeAt(0) - 38;
                }

                break;
            }
        }
    }

    return totalPriority;
}

console.log(solve(input));
```
