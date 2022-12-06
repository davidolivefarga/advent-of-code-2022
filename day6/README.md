# Day 6: Tuning Trouble

You can find the puzzles [here](https://adventofcode.com/2022/day/6).

## ✍🏼 Input

A string composed of lower-case characters.

Example:

```js
const input = "mjqjpqmgbljsphdztnvjfqwrcgsmlb";
```

## 🧩 First puzzle

### Objective

Find the first group of 4 distinct characters and return the positon of the last character of the group.

### Solution

The straight-forward way to solve this puzzle is to create sets for each group of 4 characters, and then check their size to verfiy if the group contains 4 unique characters or not. While this will work and it is simple to code, it's not efficient because we're losing a lot of knowledge between checks: two consecutive groups have 3 elements in common, so there must be a way to apply the knowledge obtained in a group when checking the next one. This strategy is known as the [sliding window technique](https://stackoverflow.com/a/64111403).

In our particular problem, we just need to keep track of the character frequencies and the amount of unique characters as we slide a window of size 4 over our input string. Every time the window moves, we update that data with the character we lost and the character we gained. Once we find a total of 4 unique characters, we're done.

Using the sliding window technique might seem an overkill with a window of size 4, but it will scale well if the window size increases.

```js
const input = require("./input");

const WINDOW_SIZE = 4;

function solve(str) {
    const characterFrequencies = {};

    let uniqueCharactersCount = 0;

    for (let i = 0; i < str.length; i++) {
        const characterToRemove = str[i - WINDOW_SIZE];

        if (characterToRemove) {
            characterFrequencies[characterToRemove]--;

            if (characterFrequencies[characterToRemove] === 0) {
                uniqueCharactersCount--;
            }
        }

        const characterToAdd = str[i];

        if (!characterFrequencies[characterToAdd]) {
            characterFrequencies[characterToAdd] = 1;
            uniqueCharactersCount++;
        } else {
            characterFrequencies[characterToAdd]++;
        }

        if (uniqueCharactersCount === WINDOW_SIZE) {
            return i + 1;
        }
    }
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Find the first group of 14 distinct characters and return the positon of the last character of the group.

### Solution

Same solution as before, just chaining the window size.

```js
const input = require("./input");

const WINDOW_SIZE = 14;

function solve(str) {
    const characterFrequencies = {};

    let uniqueCharactersCount = 0;

    for (let i = 0; i < str.length; i++) {
        const characterToRemove = str[i - WINDOW_SIZE];

        if (characterToRemove) {
            characterFrequencies[characterToRemove]--;

            if (characterFrequencies[characterToRemove] === 0) {
                uniqueCharactersCount--;
            }
        }

        const characterToAdd = str[i];

        if (!characterFrequencies[characterToAdd]) {
            characterFrequencies[characterToAdd] = 1;
            uniqueCharactersCount++;
        } else {
            characterFrequencies[characterToAdd]++;
        }

        if (uniqueCharactersCount === WINDOW_SIZE) {
            return i + 1;
        }
    }
}

console.log(solve(input));
```
