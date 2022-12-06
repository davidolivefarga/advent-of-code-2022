# Day 5: Supply Stacks

You can find the puzzles [here](https://adventofcode.com/2022/day/5).

## ✍🏼 Input

There are two inputs:

-   A list of stacks of crates represented as an array (the first element represents the bottom of the stack)
-   A list of instructions to move a given amount of crates from one stack to another

Example:

```js
const input = {
    crateStacks: [["Z", "N"], ["M", "C", "D"], ["P"]],
    instructions: [
        [1, 1, 0],
        [3, 0, 2],
        [2, 1, 0],
        [1, 0, 1],
    ],
};
```

I usually don't include the raw input parsing as part of the puzzle solutions, because I don't think it's very interesting. However, this time parsing the input was harder than solving the puzzles, so if you're interested in that, you can check it [here](./input.js).

## 🧩 First puzzle

### Objective

An instruction of the form `[x, y, z]` means moving `x` boxes _one by one_ from stack `y` to stack `z`.

Find the boxes that end up on top of each stack after all the instructions are completed.

### Solution

Straight-forward solution, nothing interesting to add.

```js
const { crateStacks, instructions } = require("./input");

function solve(crateStacks, instructions) {
    instructions.forEach((instruction) => {
        const [amount, originStack, targetStack] = instruction;

        for (let i = 0; i < amount; i++) {
            crateStacks[targetStack].push(crateStacks[originStack].pop());
        }
    });

    return crateStacks.map((crates) => crates.pop()).join("");
}

console.log(solve(crateStacks, instructions));
```

## 🧩 Second puzzle

### Objective

An instruction of the form `[x, y, z]` means moving `x` boxes _in one move, keeping the stack order_ from stack `y` to stack `z`.

Find the boxes that end up on top of each stack after all the instructions are completed.

### Solution

Straight-forward solution, nothing interesting to add.

```js
const { crateStacks, instructions } = require("./input");

function solve(crateStacks, instructions) {
    instructions.forEach((instruction) => {
        const [amount, originStack, targetStack] = instruction;

        const cratesToMove = crateStacks[originStack].splice(-amount, amount);

        crateStacks[targetStack].push(...cratesToMove);
    });

    return crateStacks.map((crates) => crates.pop()).join("");
}

console.log(solve(crateStacks, instructions));
```
