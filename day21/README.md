# Day 21: Monkey Math

You can find the puzzles [here](https://adventofcode.com/2022/day/21).

## ✍🏼 Input

An object describing monkeys.

The key represents the monkey name, while the value represents the monkey number.

The monkey number can be an integer or an arithmetic expression involving two other monkeys.

Example:

```js
const input = {
    root: ["pppw", "+", "sjmn"],
    dbpl: 5,
    cczh: ["sllz", "+", "lgvd"],
    zczc: 2,
    ptdq: ["humn", "-", "dvpt"],
    dvpt: 3,
    lfqf: 4,
    humn: 5,
    ljgn: 2,
    sjmn: ["drzm", "*", "dbpl"],
    sllz: 4,
    pppw: ["cczh", "/", "lfqf"],
    lgvd: ["ljgn", "*", "ptdq"],
    drzm: ["hmdt", "-", "zczc"],
    hmdt: 32,
};
```

## 🧩 First puzzle

### Objective

Find the number of the monkey named `root`.

### Solution

Straight-forward solution, just recursion with caching for the sub-problems.

```js
const input = require("./input");

function solve(monkeys) {
    const monkeyNumbers = {};

    function getMonkeyNumber(monkeyName) {
        if (monkeyNumbers[monkeyName] !== undefined) {
            return monkeyNumbers[monkeyName];
        }

        let monkeyNumber;

        if (!Array.isArray(monkeys[monkeyName])) {
            monkeyNumber = monkeys[monkeyName];
        } else {
            const [m1, operation, m2] = monkeys[monkeyName];

            const m1Number = getMonkeyNumber(m1);
            const m2Number = getMonkeyNumber(m2);

            if (operation === "+") {
                monkeyNumber = m1Number + m2Number;
            } else if (operation === "-") {
                monkeyNumber = m1Number - m2Number;
            } else if (operation === "*") {
                monkeyNumber = m1Number * m2Number;
            } else {
                monkeyNumber = m1Number / m2Number;
            }
        }

        monkeyNumbers[monkeyName] = monkeyNumber;

        return monkeyNumber;
    }

    return getMonkeyNumber("root");
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Find the number we need to assign to the `humn` monkey so that the two operands of the `root` monkey coincide.

### Solution

I tried thinking of a bulletproof solution for this one, with no success. Ideally, you should build the equation with `humn` as a variable and then solve for it, but there's no way I'm going to spend the time to implement such thing in JavaScript... So the alternative is to assume some things and then see if the solutions works.

In my case, I worked with the assumption that the equation representing the difference between the two operands of `root` is linear on `humn`. Of course, this is not a guarantee, because it's possible to have an equation like `1 / humn`, which is clearly not linear. But as it turns out, this assumption is true for the given input. Assuming the equation is linear on `humn` is very powerful, because a linear function is always increasing or decreasing (it has a constant derivative).

The fact that the equation is supposed to have exactly one solution (otherwise the puzzle would be ambiguous) combined with the fact that the equation is always increasing or decreasing allows us to apply some sort of binary search to find the solution. We just need to find two values of `humn`, one where the equation evaluates to a negative number and one where the equation evaluates to a positive number, and then apply binary search until we find the value where the equation evaluates to zero.

By inspection, I found that evaluating the equation on `Number.MIN_SAFE_INTEGER` yields a negative value, whereas evaluating it in `Number.MAX_SAFE_INTEGER` yields a positive one. I was lucky here, because these big numbers could cause overflow problems, but apparently they don't for the given input.

```js
const input = require("./input");

function solve(monkeys) {
    let left = Number.MIN_SAFE_INTEGER;
    let right = Number.MAX_SAFE_INTEGER;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midDiff = getDiffRootElements(monkeys, mid);

        if (midDiff === 0) {
            return mid;
        }

        if (midDiff < 0) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
}

function getDiffRootElements(monkeys, humanValue) {
    const monkeyNumbers = {};

    monkeyNumbers["humn"] = humanValue;

    function getMonkeyNumber(monkeyName) {
        if (monkeyNumbers[monkeyName] !== undefined) {
            return monkeyNumbers[monkeyName];
        }

        let monkeyNumber;

        if (!Array.isArray(monkeys[monkeyName])) {
            monkeyNumber = monkeys[monkeyName];
        } else {
            const [m1, operation, m2] = monkeys[monkeyName];

            const m1Number = getMonkeyNumber(m1);
            const m2Number = getMonkeyNumber(m2);

            if (operation === "+") {
                monkeyNumber = m1Number + m2Number;
            } else if (operation === "-") {
                monkeyNumber = m1Number - m2Number;
            } else if (operation === "*") {
                monkeyNumber = m1Number * m2Number;
            } else {
                monkeyNumber = m1Number / m2Number;
            }
        }

        monkeyNumbers[monkeyName] = monkeyNumber;

        return monkeyNumber;
    }

    const [rootLeft, _, rootRight] = monkeys["root"];

    return getMonkeyNumber(rootRight) - getMonkeyNumber(rootLeft);
}

console.log(solve(input));
```
