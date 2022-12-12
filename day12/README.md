# Day 12: Hill Climbing Algorithm

You can find the puzzles [here](https://adventofcode.com/2022/day/12).

## ✍🏼 Input

A grid of lowercase characters, except one `S` and one `E`.

Example:

```js
const input = [
    ["S", "a", "b", "q", "p", "o", "n", "m"],
    ["a", "b", "c", "r", "y", "x", "x", "l"],
    ["a", "c", "c", "s", "z", "E", "x", "k"],
    ["a", "c", "c", "t", "u", "v", "w", "j"],
    ["a", "b", "d", "e", "f", "g", "h", "i"],
];
```

## 🧩 First puzzle

### Objective

The grid represents elevations on an area, `a` is the lowest height while `z` is the highest one. From any given position in the grid, you can move one step up, down, left or right (unless you would move outisde the grid) as long as the elevation of the destination position is at most one higher than the elevation of the current position.

The letter `S` marks the start position (which has elevation `a`) and the letter `E` marks the end position (which has elevation `z`).

Find the minimum number of steps required to move from `S` to `E`.

### Solution

As preparation, we transform the elevation characters to integers to facilitate calculations and locate the positions of `S` and `E`.

Then, for the algorithm:

-   Initialise the current positions with `S` position
-   Then, while we have current positions:
    -   Initialise the next positions with an empty array
    -   Then, for each current position:
        -   If it's `E` position, we're finished
        -   If it's a position we already visited, we ignore it
        -   If it's possible to move up/down/left/right, we add these positions to the list of next positions
    -   Next positions become the new current positions

As in previous puzzles, we encode the position coordinates so that we can use a set to easily avoid visiting the same position multiple times.

```js
const input = require("./input");

function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    let start;
    let end;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === "S") {
                start = [r, c];
                grid[r][c] = "a".charCodeAt(0);
            } else if (grid[r][c] === "E") {
                end = [r, c];
                grid[r][c] = "z".charCodeAt(0);
            } else {
                grid[r][c] = grid[r][c].charCodeAt(0);
            }
        }
    }

    const visitedPositions = new Set();

    let currentPositions = [start];
    let steps = 0;

    while (currentPositions.length) {
        const nextPositions = [];

        for (const [r, c] of currentPositions) {
            if (r === end[0] && c === end[1]) {
                return steps;
            }

            const encodedPosition = `${r}@${c}`;

            if (visitedPositions.has(encodedPosition)) {
                continue;
            }

            visitedPositions.add(encodedPosition);

            if (r > 0 && grid[r - 1][c] <= grid[r][c] + 1) {
                nextPositions.push([r - 1, c]);
            }

            if (r < rows - 1 && grid[r + 1][c] <= grid[r][c] + 1) {
                nextPositions.push([r + 1, c]);
            }

            if (c > 0 && grid[r][c - 1] <= grid[r][c] + 1) {
                nextPositions.push([r, c - 1]);
            }

            if (c < cols - 1 && grid[r][c + 1] <= grid[r][c] + 1) {
                nextPositions.push([r, c + 1]);
            }
        }

        currentPositions = nextPositions;
        steps++;
    }
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same situation as before, but this time we want to find the minimum number of steps required to move from any `a` position (including `S`) to `E`.

### Solution

Same algorithm as before, but this time we start from `E` and stop as soon as we reach an `a` position.

```js
const input = require("./input");

function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    const target = "a".charCodeAt(0);

    let start;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === "S") {
                grid[r][c] = "a".charCodeAt(0);
            } else if (grid[r][c] === "E") {
                start = [r, c];
                grid[r][c] = "z".charCodeAt(0);
            } else {
                grid[r][c] = grid[r][c].charCodeAt(0);
            }
        }
    }

    const visitedPositions = new Set();

    let currentPositions = [start];
    let steps = 0;

    while (currentPositions.length) {
        const nextPositions = [];

        for (const [r, c] of currentPositions) {
            if (grid[r][c] === target) {
                return steps;
            }

            const encodedPosition = `${r}@${c}`;

            if (visitedPositions.has(encodedPosition)) {
                continue;
            } else {
                visitedPositions.add(encodedPosition);
            }

            if (r > 0 && grid[r - 1][c] >= grid[r][c] - 1) {
                nextPositions.push([r - 1, c]);
            }

            if (r < rows - 1 && grid[r + 1][c] >= grid[r][c] - 1) {
                nextPositions.push([r + 1, c]);
            }

            if (c > 0 && grid[r][c - 1] >= grid[r][c] - 1) {
                nextPositions.push([r, c - 1]);
            }

            if (c < cols - 1 && grid[r][c + 1] >= grid[r][c] - 1) {
                nextPositions.push([r, c + 1]);
            }
        }

        currentPositions = nextPositions;
        steps++;
    }
}

console.log(solve(input));
```
