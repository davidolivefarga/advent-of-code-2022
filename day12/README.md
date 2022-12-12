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

Then, we just need to apply a [BFS algorithm](https://en.wikipedia.org/wiki/Breadth-first_search) adapted to the situation.

```js
const input = require("./input");

const DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
];

function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    let start;
    let end;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === "S") {
                start = [r, c];
                grid[r][c] = "a";
            } else if (grid[r][c] === "E") {
                end = [r, c];
                grid[r][c] = "z";
            }

            grid[r][c] = grid[r][c].charCodeAt(0);
        }
    }

    const visited = Array.from({ length: rows }, () => new Array(cols));

    visited[start[0]][start[1]] = true;

    let positions = [start];
    let steps = 0;

    while (positions.length) {
        const nextPositions = [];

        for (const [r, c] of positions) {
            if (r === end[0] && c === end[1]) {
                return steps;
            }

            DIRECTIONS.forEach(([dr, dc]) => {
                const nr = r + dr;
                const nc = c + dc;

                if (
                    nr >= 0 &&
                    nr < rows &&
                    nc >= 0 &&
                    nc < cols &&
                    !visited[nr][nc] &&
                    grid[nr][nc] - grid[r][c] <= 1
                ) {
                    nextPositions.push([nr, nc]);
                    visited[nr][nc] = true;
                }
            });
        }

        positions = nextPositions;
        steps++;
    }
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same situation as before, but this time we want to find the minimum number of steps required to move from any `a` position (including `S`) to `E`.

### Solution

Same solution as before, but this time we start from `E` and stop as soon as we reach an `a` position.

```js
const input = require("./input");

const DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
];

function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    const target = "a".charCodeAt(0);

    let start;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === "S") {
                grid[r][c] = "a";
            } else if (grid[r][c] === "E") {
                start = [r, c];
                grid[r][c] = "z";
            }

            grid[r][c] = grid[r][c].charCodeAt(0);
        }
    }

    const visited = Array.from({ length: rows }, () => new Array(cols));

    visited[start[0]][start[1]] = true;

    let positions = [start];
    let steps = 0;

    while (positions.length) {
        const nextPositions = [];

        for (const [r, c] of positions) {
            if (grid[r][c] === target) {
                return steps;
            }

            DIRECTIONS.forEach(([dr, dc]) => {
                const nr = r + dr;
                const nc = c + dc;

                if (
                    nr >= 0 &&
                    nr < rows &&
                    nc >= 0 &&
                    nc < cols &&
                    !visited[nr][nc] &&
                    grid[r][c] - grid[nr][nc] <= 1
                ) {
                    nextPositions.push([nr, nc]);
                    visited[nr][nc] = true;
                }
            });
        }

        positions = nextPositions;
        steps++;
    }
}

console.log(solve(input));
```
