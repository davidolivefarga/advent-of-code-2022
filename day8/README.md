# Day 8: Treetop Tree House

You can find the puzzles [here](https://adventofcode.com/2022/day/8).

## ✍🏼 Input

A grid representing trees.

A tree is represented by its height, a single integer digit (from 0 to 9).

Example:

```js
const input = [
    [3, 0, 3, 7, 3],
    [2, 5, 5, 1, 2],
    [6, 5, 3, 3, 2],
    [3, 3, 5, 4, 9],
    [3, 5, 3, 9, 0],
];
```

## 🧩 First puzzle

### Objective

A tree is visible from outside the grid if all of the other trees between it and an edge of the grid are shorter than it. Only consider trees in the same row or column, that is: only look up, down, left, or right from any given tree.

Find the number of trees that are visible from outside the grid.

### Solution

The idea is to loop over all rows and columns from both possible directions (left/right for a row, up/down for a column) and keep track of the highest tree we found so far. If the next tree is blocked (equal or smaller size) we stop looping; else, if the next tree is not blocked, we add it to the count it.

To avoid counting the same tree multiple times, we're identifying each tree with a unique string generated from its coordinates and registering it in a set.

```js
const input = require("./input");

function solve(treeHeights) {
    const rows = treeHeights.length;
    const cols = treeHeights[0].length;

    const visibleTrees = new Set();

    function iterate(row, col, direction) {
        let maxTreeHeight = Number.NEGATIVE_INFINITY;

        while (row >= 0 && row < rows && col >= 0 && col < cols) {
            if (treeHeights[row][col] > maxTreeHeight) {
                maxTreeHeight = treeHeights[row][col];
                visibleTrees.add(`${row}@${col}`);
            }

            row += direction[0];
            col += direction[1];
        }
    }

    for (let row = 0; row < rows; row++) {
        iterate(row, 0, [0, 1]);
        iterate(row, cols - 1, [0, -1]);
    }

    for (let col = 0; col < cols; col++) {
        iterate(0, col, [1, 0]);
        iterate(rows - 1, col, [-1, 0]);
    }

    return visibleTrees.size;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Given a tree and a direction, the viewing distance in that direction is calculated by counting trees in that direction until we reach an edge or a tree with height equal or taller than the the height of the given tree. The scenic score of a tree is calculated by multiplying its viewing distances from all possible directions (up, down, left and right).

Find the highest scenic score amongst all trees.

### Solution

My first solution was the straight-forward one: for each tree, loop over its row and column to calculate its scenic score and keep track of the heighest one. However, if the dimensions of the grid are `m x n`, this solution takes `O(m * n * (m + n))` time and `O(1)` space. Cubic time complexity is not good, it works for the given input but it would explode for grids with higher dimensions.

So I started thinking if there was a way to reuse calculations in order to reduce the time complexity, even if that meant increasing the space complexity... Nothing came to mind, so I decided to explore solutions from other people until I found [this solution](https://github.com/lelouch-of-the-code/Advent-Of-Code-22/blob/main/day8/B.py) in [this Reddit thread](https://www.reddit.com/r/adventofcode/comments/zfpnka/comment/izd8iy6/?utm_source=share&utm_medium=web2x&context=3), which claimed to take `O(m * n)` time. So, my only job here was to understand that solution and translate it to Javascript, all credit goes to [@lelouch-of-the-code](https://github.com/lelouch-of-the-code).

The main idea is to create another `m x n` grid to store the scenic score of each tree. Then, we will loop over all rows and columns from both possible directions (left/right for a row, up/down for a column) and calculate its viewing distance on that direction. Using that viewing distance, we will update the scenic score of that tree. Finally, we will calculate the maximum scenic score of all trees.

The tricky part is to calculate the viewing distances in an efficient way, I'll try my best to explain the idea.

Imagine you have this row of trees, and you're looping it from left to right:

```
3 - 0 - 3 - 7 - 3
```

To avoid falling outside the edge, we'll add a fake tree with infinite height at the left:

```
∞ - 0 - 3 - 7 - 3
```

For each tree, we keep track of the number of trees that it has behind it (the fake tree doesn't count):

```
(∞, 0) - (3,0) - (0,1) - (3,2) - (7,3) - (3,4)
```

Now, the question you need to ask yourself is: what information do I need to compute the viewing distance of each tree?

-   For `(3, 0)`, I need to know that it will be blocked by `(∞, 0)` -> viewing distance: 0
-   For `(0, 1)`, I need to know that it will be blocked by `(3, 0)` -> viewing distance: 1
-   For `(3, 2)`, I need to know that it will be blocked by `(3, 0)` -> viewing distance: 2
-   For `(7, 3)`, I need to know that it will be blocked by `(∞, 0)` -> viewing distance: 3
-   For `(3, 4)`, I need to know that it will be blocked by `(3, 2)` -> viewing distance: 2

Maybe this sample is not representative, but hopefully it's enough to understand that if a tree `(h1, b1)` is blocked by a tree `(h2, b2)`, then the viewing distance of `h1` in that direction will be `b1 - b2` (we count all trees behind `h1` and then subtract all trees behind `h2`, the blocking tree).

So, we only care about the blocker trees. This means that as soon as we reach a tree of height `h`, we no longer care about the trees with height smaller than `h`, because we know they will never be blocker: if `h` itself is not blocking a future tree, smaller heights won't block it either.

With this ideas in mind, we can build ourself a stack to keep track of these `(h, b)` pairs, and update it as follows:

-   Initially, the stack contains the fake tree: `[(∞, 0)]`.
-   Then, for each tree `(h1, b1)`:
    -   We get the last tree of the stack; if its height is smaller than `h1`, we remove it from the stack, because it's not a blocker and will never be for future trees.
    -   We repeat the previous process until we find a blocker tree `(h2, b2)` (it is guaranteed we'll find one because our stack contains a tree with infinite height, which will always be a blocker). With this information, we can compute the viewing distance of `h1`: `b1 - b2`.
    -   We add `(h1, b1)` to the stack, as the current tree could be a blocker for future trees.

Since each pair `(h, b)` is added at most once and remove at most once, the complexity of this process will be `O(n)` time / `O(n)` space (if we're looping through a row) or `O(m)` time / `O(m)` space (if we're looping through a column). We also need an additional `O(m * n)` space to keep track of the scenic scores. Hence, as we're looping through all rows and columns, this solution will take `O(m * n)` time and `O(m * n)` space in total, which is way better for grids with higher dimensions.

```js
const input = require("./input");

function solve(treeHeights) {
    const rows = treeHeights.length;
    const cols = treeHeights[0].length;

    const scenicScores = Array.from({ length: rows }, () =>
        Array.from({ length: cols }).fill(1)
    );

    function iterate(row, col, direction) {
        const visitedTrees = [];

        visitedTrees.push({ height: Number.POSITIVE_INFINITY, treesBehind: 0 });

        let treesBehindCurrentTree = 0;

        while (row >= 0 && row < rows && col >= 0 && col < cols) {
            currentTreeHeight = treeHeights[row][col];

            while (
                visitedTrees[visitedTrees.length - 1].height < currentTreeHeight
            ) {
                visitedTrees.pop();
            }

            const visibleTreesBehindCurrentTree =
                treesBehindCurrentTree -
                visitedTrees[visitedTrees.length - 1].treesBehind;

            scenicScores[row][col] *= visibleTreesBehindCurrentTree;

            visitedTrees.push({
                height: currentTreeHeight,
                treesBehind: treesBehindCurrentTree,
            });

            row += direction[0];
            col += direction[1];

            treesBehindCurrentTree++;
        }
    }

    for (let row = 0; row < rows; row++) {
        iterate(row, 0, [0, 1]);
        iterate(row, cols - 1, [0, -1]);
    }

    for (let col = 0; col < cols; col++) {
        iterate(0, col, [1, 0]);
        iterate(rows - 1, col, [-1, 0]);
    }

    let maxScenicScore = Number.NEGATIVE_INFINITY;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            maxScenicScore = Math.max(maxScenicScore, scenicScores[row][col]);
        }
    }

    return maxScenicScore;
}

console.log(solve(input));
```
