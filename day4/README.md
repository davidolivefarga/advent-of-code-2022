# Day 4: Camp Cleanup

You can find the puzzles [here](https://adventofcode.com/2022/day/4).

## ✍🏼 Input

A list of pairs of ranges of integer numbers.

Example:

```js
const input = [
    [
        [2, 4],
        [6, 8],
    ],
    [
        [5, 7],
        [7, 9],
    ],
    [
        [2, 8],
        [3, 7],
    ],
    [
        [6, 6],
        [4, 6],
    ],
];
```

## 🧩 First puzzle

### Objective

Count the number of pairs where one of the ranges is fully contained in the other.

### Solution

There are two possiblties to have a range contained in the other:

1. `[x1, y1]` is inside `[x2, y2]`:

    ```
    ----[---[-----]---]----
       x2   x1   y1   y2
    ```

    The condition is: `x1 >= x2 && y1 <= y2`.

2. `[x2, y2]` is inside `[x1, y1]`:

    ```
    ----[---[-----]---]----
       x1   x2   y2   y1
    ```

    The condition is: `x2 >= x1 && y2 <= y1`.

With this in mind, the solution is straight-forward.

```js
const input = require("./input");

function solve(pairs) {
    return pairs.reduce((fullyContainedRangesCount, pair) => {
        const [[x1, y1], [x2, y2]] = pair;

        return (x1 >= x2 && y1 <= y2) || (x2 >= x1 && y2 <= y1)
            ? fullyContainedRangesCount + 1
            : fullyContainedRangesCount;
    }, 0);
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Count the number of pairs whose ranges are overlapping.

### Solution

There are several positionings that will result on both ranges overlapping, so I always think it's faster to think about the opposite case and the negate the condition. There are two possibilities to have both ranges _not_ overlap:

1. `[x1, y1]` is on the left of `[x2, y2]`:

    ```
    ----[---]-----[---]----
       x1   y1   x2   y2
    ```

    The condition is: `y1 < x2`.

2. `[x1, y1]` is on the right of `[x2, y2]`:

    ```
    ----[---]-----[---]----
       x2   y2   x1   y1
    ```

    The condition is: `y2 < x1`.

So, the two ranges _won't_ overlap if `y1 < x2 || y2 < x1`, which means that the ranges _will_ overlap if `!(y1 < x2 || y2 < x1)`, which can be rewritten as `x2 <= y1 && x1 <= y2`.

With this in mind, the solution is straight-forward.

```js
const input = require("./input");

function solve(pairs) {
    return pairs.reduce((overlappingRangesCount, pair) => {
        const [[x1, y1], [x2, y2]] = pair;

        return x2 <= y1 && x1 <= y2
            ? overlappingRangesCount + 1
            : overlappingRangesCount;
    }, 0);
}

console.log(solve(input));
```
