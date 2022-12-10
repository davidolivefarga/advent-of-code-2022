# Day 9: Rope Bridge

You can find the puzzles [here](https://adventofcode.com/2022/day/9).

## ✍🏼 Input

A list of instructions, each instruction consisting on a direction and a number of steps.

There are four possible directions:

-   `U`: up
-   `D`: down
-   `L`: left
-   `R`: right

Example:

```js
const input = [
    ["R", 4],
    ["U", 4],
    ["L", 3],
    ["D", 1],
    ["R", 4],
    ["D", 1],
    ["L", 5],
    ["R", 2],
];
```

## 🧩 First puzzle

### Objective

There's a rope with two knots, called `head` and `tail`. Since `head` and `tail` are connected by the rope, `head` and `tail` will always be touching (diagonally, adjacent and even overlapping count as touching). If, after moving `head`, `head` and `tail` are not touching:

-   If `head` is two steps directly up, down, left, or right from `tail`, then `tail` must also move one step in that direction.
-   If `head` and `tail` aren't in the same row or column, then `tail` must move diagonally in the direction that keep it close to `head`.

Find all the positions visited by `tail` after applying all the movements specified in the instructions.

### Solution

The trick here is to notice that if `head` and `tail` stop touching after moving `head`, then `tail` will take the position of `head` before it moved. So, the only thing we need to do is to find if `head` and `tail` are no longer touching after `head` moves, and to do that we just need to see if they are two rows or two columns apart.

The other interesting thing worth mentioning is that in order to registered the positions visited by `tail`, we're encoding the position as a string so that we can store them in a set and avoid counting them multiple times.

```js
const input = require("./input");

const DIRECTIONS = {
    U: [0, 1],
    D: [0, -1],
    L: [-1, 0],
    R: [1, 0],
};

function solve(instructions) {
    const positionsVisitedByTail = new Set();

    let head = [0, 0];
    let tail = [0, 0];

    positionsVisitedByTail.add(encodeKnot(tail));

    instructions.forEach(([directionName, steps]) => {
        const direction = DIRECTIONS[directionName];

        for (let i = 0; i < steps; i++) {
            const newHead = [head[0] + direction[0], head[1] + direction[1]];

            if (!areKnotsTouching(newHead, tail)) {
                tail = head;

                positionsVisitedByTail.add(encodeKnot(tail));
            }

            head = newHead;
        }
    });

    return positionsVisitedByTail.size;
}

function encodeKnot(knot) {
    return `${knot[0]}@${knot[1]}`;
}

function areKnotsTouching(knot1, knot2) {
    return (
        Math.abs(knot1[0] - knot2[0]) < 2 && Math.abs(knot1[1] - knot2[1]) < 2
    );
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same as before, but this time the rope has 10 knots, so that the first knot (the `head`) must touch the second knot, the second knot must touch the third knot, and so on until we reach the last knot (the `tail`).

Find all the positions visited by `tail` after applying all the movements specified in the instructions.

### Solution

Unfortunately, this time we cannot use the trick from the previous puzzle.

To understand why, let's look at the following diagram, representing the first three knots after we move the first knot one step up:

```
***      *1*      *1*      *1*
*1*      ***      *2*      *2*
**2  ->  **2  ->  ***  ->  *3*
*3*      *3*      *3*      ***
***      ***      ***      ***
```

As you can see, all knots moved, but knot `3` didn't take the old position of knot `2`.

So, instead of relying on tricks we will apply the following process each time we need to move the first knot:

-   Move the first knot.
-   Check if the second knot and the first knot are still touching.
    -   If they are touching, stop the process: if the second knot didn't move, neither will the next knots.
    -   If they are not touching, calculate the normalized direction between the knots and move the second knot in that direction. The reason we're normalizing the direction is because a knot cannot move two or more columns and/or rows in one step. Then, repeat the process for the next knot.

Finally, we just need to register the `tail` positions using a set, as we did in the previous puzzle.

```js
const input = require("./input");

const DIRECTIONS = {
    U: [0, 1],
    D: [0, -1],
    L: [-1, 0],
    R: [1, 0],
};

function solve(instructions) {
    const positionsVisitedByTail = new Set();

    const knots = Array.from({ length: 10 }, () => [0, 0]);

    positionsVisitedByTail.add(encodeKnot(knots[knots.length - 1]));

    instructions.forEach(([directionName, steps]) => {
        const direction = DIRECTIONS[directionName];

        for (let i = 0; i < steps; i++) {
            moveKnot(knots[0], direction);

            for (let j = 1; j < knots.length; j++) {
                const currKnot = knots[j];
                const prevKnot = knots[j - 1];

                if (areKnotsTouching(currKnot, prevKnot)) {
                    break;
                }

                moveKnot(currKnot, getNormalizedDirection(currKnot, prevKnot));
            }

            positionsVisitedByTail.add(encodeKnot(knots[knots.length - 1]));
        }
    });

    return positionsVisitedByTail.size;
}

function encodeKnot(knot) {
    return `${knot[0]}@${knot[1]}`;
}

function areKnotsTouching(knot1, knot2) {
    return (
        Math.abs(knot1[0] - knot2[0]) < 2 && Math.abs(knot1[1] - knot2[1]) < 2
    );
}

function moveKnot(knot, direction) {
    knot[0] += direction[0];
    knot[1] += direction[1];
}

function getNormalizedDirection(originKnot, targetKnot) {
    return [
        (targetKnot[0] - originKnot[0]) /
            (Math.abs(targetKnot[0] - originKnot[0]) || 1),
        (targetKnot[1] - originKnot[1]) /
            (Math.abs(targetKnot[1] - originKnot[1]) || 1),
    ];
}

console.log(solve(input));
```
