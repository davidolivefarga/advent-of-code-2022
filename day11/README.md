# Day 11: Monkey in the Middle

You can find the puzzles [here](https://adventofcode.com/2022/day/11).

## ✍🏼 Input

A list of monkeys, each monkey containing:

-   `items`: a list of items, represented as positive integers
-   `operation`: a data structure, consisting of:
    -   `operator`: either a `+` or `*`
    -   `value`: either a positive integer or `item`
-   `test`: a data structure, consisting of:
    -   `divisor`: a positive integer
    -   `caseTrue`: a positive integer or 0
    -   `caseFalse`: a positive integer or 0

Example:

```js
const input = [
    {
        items: [79, 98],
        operation: { operator: "*", value: 19 },
        test: { divisor: 23, caseTrue: 2, caseFalse: 3 },
    },
    {
        items: [54, 65, 75, 74],
        operation: { operator: "+", value: 6 },
        test: { divisor: 19, caseTrue: 2, caseFalse: 0 },
    },
    {
        items: [79, 60, 97],
        operation: { operator: "*", value: "self" },
        test: { divisor: 13, caseTrue: 1, caseFalse: 3 },
    },
    {
        items: [74],
        operation: { operator: "+", value: 3 },
        test: { divisor: 17, caseTrue: 0, caseFalse: 1 },
    },
];
```

## 🧩 First puzzle

### Objective

Each round, monkeys inspect their items, according to the following rules:

-   Monkeys act in order: first monkey `0`, then monkey `1` and so on.
-   Monkeys inspect their items in order: first item `0`, then item `1` and so on.

When a monkey inspects an item:

-   The monkey updates the item according to its `operation`. If `value` is `item`, it is replaced by the current value of the item. Then, the new item is the result of applying the operator `operator` to the item and `value`.
-   The item is then divided by `3`, rounded down.
-   The monkey tests the item according to its `test`. If the item is divisible by `divisor`, then the item is passed to the `caseTrue` monkey; otherwise, the item is passed to the `caseFalse` monkey. When a monkey receives an item, it puts at the end of its list of items.

The monkey business is calculated by multiplying the number of inspected items from the top two monkeys that counted the most items.

Find the monkey business after `20` rounds.

### Solution

Straight-forward solution, nothing interesting to add.

```js
const input = require("./input");

function solve(monkeys) {
    monkeys.forEach((monkey) => (monkey.inspectedItems = 0));

    for (let i = 0; i < 20; i++) {
        monkeys.forEach((monkey) => {
            monkey.items.forEach((item) => {
                monkey.inspectedItems++;

                const updatedItem = Math.floor(
                    getUpdatedItem(item, monkey) / 3
                );

                const nextMonkey = getNextMonkey(updatedItem, monkey);

                monkeys[nextMonkey].items.push(updatedItem);
            });

            monkey.items = [];
        });
    }

    monkeys.sort((m1, m2) => m2.inspectedItems - m1.inspectedItems);

    return monkeys[0].inspectedItems * monkeys[1].inspectedItems;
}

function getUpdatedItem(item, monkey) {
    let { operator, value } = monkey.operation;

    if (value === "item") {
        value = item;
    }

    if (operator === "+") {
        return item + value;
    } else {
        return item * value;
    }
}

function getNextMonkey(item, monkey) {
    const { divisor, caseTrue, caseFalse } = monkey.test;

    return item % divisor === 0 ? caseTrue : caseFalse;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same game as before, but this time we're skipping the step of dividing by `3` and rounding the item down.

Find the monkey business after `10000` rounds.

### Solution

The solution for the first puzzle won't work here because the item values become _very_ big, _very_ quick, so they won't fit in 64 bits. Even if you use a library like [bigint](https://www.npmjs.com/package/bigint) (to represent numbers as strings, and operate on them this way), the numbers are so big that the solution will take a lot of time to finish.

The key idea is to realise that the monkeys only care if the numbers are divisible by their `divisor` or not. This means that some items are the same in the eyes of the monkeys. For example, imagine that there are two monkeys and their divisors are `3` and `5`. To them, an item with value `1` will be the same as any item with value `1 + 3 * 5 * k`, because the `3 * 5 * k` part will always be divisible by both `3` and `5`.

However, you might ask: what about the monkey operations? Well, [the modulo operator follows the distributive property with both `+` and `*`](https://en.wikipedia.org/wiki/Modular_arithmetic#Properties), so this won't affect how monkeys pass items to each other.

In conclusion, we can always reduce the item values applying modulo `m`, where `m` is the product of the `divisor` value of all monkeys. This will bound the maximum value of items and prevent them from occupying more than 64 bits.

_Note_: this will work for the given input, but if the number of monkeys grows (and hence, the product of their `divisor` value also grows), item values might still take more than 64 bits. In that case, we could use the least common multiple of all `divisor` values instead of simply multiplying them; it that's still not enough, we would need to use string representation using a library like `bigint`.

```js
const input = require("./input");

function solve(monkeys) {
    let commonMultiple = 1;

    monkeys.forEach((monkey) => {
        commonMultiple *= monkey.test.divisor;

        monkey.inspectedItems = 0;
    });

    for (let i = 0; i < 10000; i++) {
        monkeys.forEach((monkey) => {
            monkey.items.forEach((item) => {
                monkey.inspectedItems++;

                const updatedItem =
                    getUpdatedItem(item, monkey) % commonMultiple;

                const nextMonkey = getNextMonkey(updatedItem, monkey);

                monkeys[nextMonkey].items.push(updatedItem);
            });

            monkey.items = [];
        });
    }

    monkeys.sort((m1, m2) => m2.inspectedItems - m1.inspectedItems);

    return monkeys[0].inspectedItems * monkeys[1].inspectedItems;
}

function getUpdatedItem(item, monkey) {
    let { operator, value } = monkey.operation;

    if (value === "item") {
        value = item;
    }

    if (operator === "+") {
        return item + value;
    } else {
        return item * value;
    }
}

function getNextMonkey(item, monkey) {
    const { divisor, caseTrue, caseFalse } = monkey.test;

    return item % divisor === 0 ? caseTrue : caseFalse;
}

console.log(solve(input));
```
