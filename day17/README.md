# Day 17: Pyroclastic Flow

You can find the puzzles [here](https://adventofcode.com/2022/day/17).

## ✍🏼 Input

A string representing instructions with two possible characters: `<` and `>`.

Example:

```js
const input = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>";
```

## 🧩 First puzzle

### Objective

In this puzzle we play a game similar to Tetris where pieces are rocks.

-   The container of the rocks is `7` units wide and has infinite height.

-   There are five types of rocks:

    ```
            #      #   #
    ####   ###     #   #   ##
            #    ###   #   ##
                       #
    ```

    They keep falling in order, and once we reach the end of the list we start from the first one again.

-   A rock is always spawned in a position such that its left edge is `2` units away from the left wall and its bottom edge is `3` units above the highest rock in the room (or the floor, if there isn't one).

-   The instructions explain how the rocks will move, and they are followed in order. Once we reach the end of the list we start from the first one again.

    When a rock falls, it gets the next instruction and:

    -   If the instruction is `<`, the rock moves to the left (if that's not possible, the instruction is ignored).
    -   If the instruction is `>`, the rock moves to the right (if that's possible, the instruction is ignored).
    -   After each instruction (whether it was ignored or not), the rock tries to moves down. If it can't move down, the rock stays where it is and the next rock spawns.

Find the the height of the tower of rocks after `2022` rocks have been spawned.

### Solution

Straight-forward solution, we just need to apply the game rules and find out the height after the rocks stop spawning.

```js
const input = require("./input");

const LEFT = { dx: -1, dy: 0 };
const RIGHT = { dx: 1, dy: 0 };
const DOWN = { dx: 0, dy: -1 };

const MIN_COLUMN = 1;
const MAX_COLUMN = 7;
const MIN_HEIGHT = 1;

const NUM_ROCKS = 2022;

function solve(instructions) {
    const blockedPositions = new Set();

    let currentHeight = 0;

    let rockCount = 0;
    let rockType = 0;
    let instructionIndex = 0;

    while (rockCount < NUM_ROCKS) {
        const rock = generateRock(rockType, currentHeight);

        while (true) {
            const instruction = instructions[instructionIndex];
            const direction = instruction === "<" ? LEFT : RIGHT;

            if (canMoveRock(rock, direction, blockedPositions)) {
                moveRock(rock, direction);
            }

            instructionIndex = (instructionIndex + 1) % instructions.length;

            if (canMoveRock(rock, DOWN, blockedPositions)) {
                moveRock(rock, DOWN);
            } else {
                break;
            }
        }

        rock.forEach(({ x, y }) => {
            blockedPositions.add(`${x}@${y}`);
            currentHeight = Math.max(currentHeight, y);
        });

        rockType = (rockType + 1) % 5;
        rockCount++;
    }

    return currentHeight;
}

function generateRock(rockType, maxY) {
    const rock = [];

    if (rockType === 0) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 5, y: maxY + 4 });
    } else if (rockType === 1) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 6 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 5 });
    } else if (rockType === 2) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 6 });
    } else if (rockType === 3) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 6 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 7 });
    } else {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 5 });
    }

    return rock;
}

function canMoveRock(rock, direction, blockedPositions) {
    const { dx, dy } = direction;

    return rock.every(
        ({ x, y }) =>
            x + dx >= MIN_COLUMN &&
            x + dx <= MAX_COLUMN &&
            y + dy >= MIN_HEIGHT &&
            !blockedPositions.has(`${x + dx}@${y + dy}`)
    );
}

function moveRock(rock, direction) {
    const { dx, dy } = direction;

    rock.forEach((coordinate) => {
        coordinate.x += dx;
        coordinate.y += dy;
    });
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Find the height of the tower of rocks after `1000000000000` rocks have been spawned.

### Solution

This time it's impossible to just simulate the game, because the program would take forever to complete.

The key idea is to realise that since the rock types and the instructions follow cycles, at some point the structure of the rock tower will also follow cycles. However, the cycles won't start right away, first we need some rocks to form some sort of "stable" structure against the floor. Also, the last cycle might be incomplete because we might not have enough rocks.

So, we will have something like this:

```
<incomplete-cycle>
<cycle>
...
<cycle>
<build-up>
```

The solution will consist on simulating the process as we did in the first puzzle, but stopping as soon as we complete the first cycle. At this point, we will know:

-   The height of the build-up and how many rocks it contains
-   The height of a cycle and how many rocks it contains

Using this information we will know how many rocks will the incomplete cycle contain, so we can simulate the process a bit more to know the height of this incomplete cycle.

Then, we just need to add the height of the build-up, the height of the cycle multiplied by the amount of cycles and the height of the incomplete cycle.

The most important part of this solution is to find a heuristic to detect cycles. Initially, I considered that if at some point we repeated the same combination of rock type and instruction index, this meant we had a cycle. This heuristic worked for the sample input, but not for the real input. The reason is that even if we have the same rock type and the same instruction index, we might have different outcomes if the structure below the rock is different. So, in order to take this into account, we need to know how much empty space do we have under each column, and we can do that by keeping track of the current height in each column.

I will not go into more details about the solution because I'm not very proud of the code, I think it can be simplified a lot to make it more readable. If I have time, I'll try to polish the solution and update the explanation if necessary, although I'm pretty sure the key idea will be the same.

```js
const input = require("./input");

const LEFT = { dx: -1, dy: 0 };
const RIGHT = { dx: 1, dy: 0 };
const DOWN = { dx: 0, dy: -1 };

const MIN_COLUMN = 1;
const MAX_COLUMN = 7;
const MIN_HEIGHT = 1;

const NUM_ROCKS = 1000000000000;

function solve(instructions) {
    const blockedPositions = new Set();
    let visitedCombinations = {};

    let currentHeight = 0;
    let currentColumnHeights = new Array(7).fill(0);

    let rockCount = 0;
    let rockType = 0;
    let instructionIndex = 0;

    let heightBeforeFirstCycle;
    let heightAfterFirstCycle;
    let heightAfterAllCycles;

    let numberOfRocksInIncompleteCycle;

    while (rockCount < NUM_ROCKS) {
        const combination = getCombination(
            rockType,
            instructionIndex,
            currentColumnHeights
        );

        if (!visitedCombinations[combination]) {
            visitedCombinations[combination] = { currentHeight, rockCount };
        } else {
            const dataBeforeFirstCycle = visitedCombinations[combination];

            heightBeforeFirstCycle = dataBeforeFirstCycle.currentHeight;
            heightAfterFirstCycle = currentHeight;

            const cycleHeight = currentHeight - heightBeforeFirstCycle;
            const missingRocksBeforeFirstCycle =
                NUM_ROCKS - dataBeforeFirstCycle.rockCount;
            const numberOfRocksInCycle =
                rockCount - dataBeforeFirstCycle.rockCount;
            const numberOfCycles = Math.floor(
                missingRocksBeforeFirstCycle / numberOfRocksInCycle
            );

            heightAfterAllCycles = cycleHeight * numberOfCycles;

            numberOfRocksInIncompleteCycle =
                missingRocksBeforeFirstCycle % numberOfRocksInCycle;

            break;
        }

        const rock = generateRock(rockType, currentHeight);

        while (true) {
            const instruction = instructions[instructionIndex];

            if (
                instruction === "<" &&
                canMoveRock(rock, LEFT, blockedPositions)
            ) {
                moveRock(rock, LEFT);
            } else if (
                instruction === ">" &&
                canMoveRock(rock, RIGHT, blockedPositions)
            ) {
                moveRock(rock, RIGHT);
            }

            instructionIndex = (instructionIndex + 1) % instructions.length;

            if (canMoveRock(rock, DOWN, blockedPositions)) {
                moveRock(rock, DOWN);
            } else {
                break;
            }
        }

        rock.forEach(({ x, y }) => {
            blockedPositions.add(`${x}@${y}`);
            currentHeight = Math.max(currentHeight, y);
            currentColumnHeights[x - 1] = Math.max(
                currentColumnHeights[x - 1],
                y
            );
        });

        rockType = (rockType + 1) % 5;
        rockCount++;
    }

    for (let i = 0; i < numberOfRocksInIncompleteCycle; i++) {
        const rock = generateRock(rockType, currentHeight);

        while (true) {
            const instruction = instructions[instructionIndex];

            if (
                instruction === "<" &&
                canMoveRock(rock, LEFT, blockedPositions)
            ) {
                moveRock(rock, LEFT);
            } else if (
                instruction === ">" &&
                canMoveRock(rock, RIGHT, blockedPositions)
            ) {
                moveRock(rock, RIGHT);
            }

            instructionIndex = (instructionIndex + 1) % instructions.length;

            if (canMoveRock(rock, DOWN, blockedPositions)) {
                moveRock(rock, DOWN);
            } else {
                break;
            }
        }

        rock.forEach(({ x, y }) => {
            blockedPositions.add(`${x}@${y}`);
            currentHeight = Math.max(currentHeight, y);
        });

        rockType = (rockType + 1) % 5;
        rockCount++;
    }

    const heightFromIncompleteCycle = currentHeight - heightAfterFirstCycle;

    return (
        heightBeforeFirstCycle +
        heightAfterAllCycles +
        heightFromIncompleteCycle
    );
}

function getCombination(rockType, instructionIndex, columnHeights) {
    const maxHeight = Math.max(...columnHeights);
    const columnHeightDeltas = columnHeights.map((h) => maxHeight - h);
    const encodedColumnHeightDeltas = columnHeightDeltas.join("@");

    return `${rockType}@${instructionIndex}@${encodedColumnHeightDeltas}`;
}

function generateRock(rockType, maxY) {
    const rock = [];

    if (rockType === 0) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 5, y: maxY + 4 });
    } else if (rockType === 1) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 6 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 5 });
    } else if (rockType === 2) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 6 });
    } else if (rockType === 3) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 6 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 7 });
    } else {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 5 });
    }

    return rock;
}

function canMoveRock(rock, direction, blockedPositions) {
    const { dx, dy } = direction;

    return rock.every(
        ({ x, y }) =>
            x + dx >= MIN_COLUMN &&
            x + dx <= MAX_COLUMN &&
            y + dy >= MIN_HEIGHT &&
            !blockedPositions.has(`${x + dx}@${y + dy}`)
    );
}

function moveRock(rock, direction) {
    const { dx, dy } = direction;

    rock.forEach((coordinate) => {
        coordinate.x += dx;
        coordinate.y += dy;
    });
}

console.log(solve(input));
```
