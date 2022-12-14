# Day 14: Regolith Reservoir

You can find the puzzles [here](https://adventofcode.com/2022/day/14).

## ✍🏼 Input

A list of paths, each path consisting in a list of `x` and `y` coordinates.

After the first point of each path, each point indicates the end of a straight horizontal or vertical line to be drawn from the previous point.

Example:

```js
const input = [
    [
        { x: 498, y: 4 },
        { x: 498, y: 6 },
        { x: 496, y: 6 },
    ],
    [
        { x: 503, y: 4 },
        { x: 502, y: 4 },
        { x: 502, y: 9 },
        { x: 494, y: 9 },
    ],
];
```

## 🧩 First puzzle

### Objective

The paths represent rock tiles in a cave, with `x` representing distance to the right and `y` representing distance down.

Initially, all the other cave tiles that are not filled with rock are filled with air.

Then, sand starts to pour from tile `{ x: 500, y: 0 }` as follows:

-   Sand is produced one unit at a time, and the next unit of sand is not produced until the previous unit of sand comes to rest.
-   A unit of sand always falls down one step if possible. If the tile immediately below is blocked (by rock or sand), the unit of sand attempts to instead move diagonally one step down and to the left. If that tile is also blocked, the unit of sand attempts to instead move diagonally one step down and to the right.
-   Sand keeps moving as long as it is able to do so, at each step trying to move down, then down-left, then down-right.
-   If all three possible destinations are blocked, the unit of sand comes to rest and no longer moves (blocking the tile where it is resting), at which point the next unit of sand is created back at the source.
-   If a unit of sand keeps moving infinitely, we say that it has fallen into the abyss below.

Find the units of sand that come to rest before sand starts flowing into the abyss below.

### Solution

The solution is quite straight-forward, we just need to keep track of the blocked tiles (as usual, using a set and encoding the tile coordinates as a string) and simulate the movement of the sand tiles until we reach the abyss. We will know that we reached the abyss once the sand tile is in the same row as the deepest tile of rock in the cave, because at that point there's no more rock tiles that can block it.

```js
const input = require("./input");

function solve(rockPaths) {
    const blockedTiles = new Set();

    const blockTile = (x, y) => blockedTiles.add(`${x}@${y}`);
    const isTileBlocked = (x, y) => blockedTiles.has(`${x}@${y}`);

    let rockTilesMaxY = Number.NEGATIVE_INFINITY;

    for (const rockPath of rockPaths) {
        for (let i = 1; i < rockPath.length; i++) {
            const start = rockPath[i - 1];
            const end = rockPath[i];

            const minX = Math.min(start.x, end.x);
            const maxX = Math.max(start.x, end.x);
            const minY = Math.min(start.y, end.y);
            const maxY = Math.max(start.y, end.y);

            rockTilesMaxY = Math.max(rockTilesMaxY, maxY);

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    blockTile(x, y);
                }
            }
        }
    }

    let restingSandTiles = 0;

    while (true) {
        const sandTile = { x: 500, y: 0 };

        while (sandTile.y < rockTilesMaxY) {
            if (!isTileBlocked(sandTile.x, sandTile.y + 1)) {
                sandTile.y++;
            } else if (!isTileBlocked(sandTile.x - 1, sandTile.y + 1)) {
                sandTile.x--;
                sandTile.y++;
            } else if (!isTileBlocked(sandTile.x + 1, sandTile.y + 1)) {
                sandTile.x++;
                sandTile.y++;
            } else {
                break;
            }
        }

        if (sandTile.y === rockTilesMaxY) {
            return restingSandTiles;
        }

        blockTile(sandTile.x, sandTile.y);

        restingSandTiles++;
    }
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same rules as before, but with one change: there's no longer an abyss. Instead, now there's a floor: an infinite horizontal rock path `2` tiles below the deepest tile of rock in the cave provided in the puzzle input.

Find the units of sand that come to rest before the sand source is blocked (i. e. there's a sand tile resting at `{ x: 500, y: 0 }`).

### Solution

Very similar to the previous solution, we just need to take into account that sand tiles will rest as soon as we reach the row immediately after the floor (the deepest tile of rock provided in the puzzle input plus `1`). Then, we simulate the movement of sand until we find a sand tile blocking the sand source.

```js
const input = require("./input");

function solve(rockPaths) {
    const blockedTiles = new Set();

    const blockTile = (x, y) => blockedTiles.add(`${x}@${y}`);
    const isTileBlocked = (x, y) => blockedTiles.has(`${x}@${y}`);

    let rockTilesMaxY = Number.NEGATIVE_INFINITY;

    for (const rockPath of rockPaths) {
        for (let i = 1; i < rockPath.length; i++) {
            const start = rockPath[i - 1];
            const end = rockPath[i];

            const minX = Math.min(start.x, end.x);
            const maxX = Math.max(start.x, end.x);
            const minY = Math.min(start.y, end.y);
            const maxY = Math.max(start.y, end.y);

            rockTilesMaxY = Math.max(rockTilesMaxY, maxY);

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    blockTile(x, y);
                }
            }
        }
    }

    let restingSandTiles = 0;

    while (true) {
        const sandTile = { x: 500, y: 0 };

        while (sandTile.y < rockTilesMaxY + 1) {
            if (!isTileBlocked(sandTile.x, sandTile.y + 1)) {
                sandTile.y++;
            } else if (!isTileBlocked(sandTile.x - 1, sandTile.y + 1)) {
                sandTile.x--;
                sandTile.y++;
            } else if (!isTileBlocked(sandTile.x + 1, sandTile.y + 1)) {
                sandTile.x++;
                sandTile.y++;
            } else {
                break;
            }
        }

        if (sandTile.x === 500 && sandTile.y === 0) {
            return restingSandTiles + 1;
        }

        blockTile(sandTile.x, sandTile.y);

        restingSandTiles++;
    }
}

console.log(solve(input));
```
