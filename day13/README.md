# Day 13: Distress Signal

You can find the puzzles [here](https://adventofcode.com/2022/day/13).

## ✍🏼 Input

A list of pairs, with each element in the pair representing a list that can contain integers or other lists of integers.

Example:

```js
const input = [
    ["[1,1,3,1,1]", "[1,1,5,1,1]"],
    ["[[1],[2,3,4]]", "[[1],4]"],
    ["[9]", "[[8,7,6]]"],
    ["[[4,4],4,4]", "[[4,4],4,4,4]"],
    ["[7,7,7,7]", "[7,7,7]"],
    ["[]", "[3]"],
    ["[[[]]]", "[[]]"],
    ["[1,[2,[3,[4,[5,6,7]]]],8,9]", "[1,[2,[3,[4,[5,6,0]]]],8,9]"],
];
```

## 🧩 First puzzle

### Objective

Given a pair of lists, we can determine if one is smaller than the other by comparing their items.

Items are compared according to the following rules:

-   If both items are integers:
    -   If the integer from the first list is smaller than the one in the second list, the first list is smaller.
    -   Else, if the integer from the first list is bigger than the one in the second list, the second list is smaller.
    -   Else, we check the next pair of items.
-   If both items are lists, compare the first value of each list, then the second one, and so on:
    -   If one of this comparations determines which of the lists is smaller, we're done.
    -   Else, if the first list runs out of items first, the first list is smaller.
    -   Else, if the second list runs out of items first, the second list is smaller.
    -   Else, we check the next pair of items.
-   If one of the items is a list and the other one is not, we wrap the integer item in a list and then we compare them as lists.

Find the sum of the positions of the pairs whose first list is smaller than its second list.

### Solution

First of all, we can parse the pair lists using JavaScript's [eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) function. This is what I chose for my solutions, but at the same time I think that the interesting part of the puzzle is to create your own algortihm to parse the lists... So I also created a function to do this, even though I'm not using it in the solutions:

```js
function parseList(rawList) {
    const listStack = [[]];

    let currentNumber = "";

    for (const c of rawList) {
        if (c === "[") {
            const newList = [];

            listStack.push(newList);
        } else if (c === "]" || c == ",") {
            const currentList = listStack[listStack.length - 1];

            if (currentNumber) {
                currentList.push(Number(currentNumber));

                currentNumber = "";
            }

            if (c === "]") {
                const parentList = listStack[listStack.length - 2];

                parentList.push(currentList);

                listStack.pop();
            }
        } else {
            currentNumber += c;
        }
    }

    return listStack[0][0];
}
```

The main idea is to keep track of the nested lists in a stack and to keep track of the current number.

-   If we find a `[`, this means we have a new list, so we add it to the stack
-   If we find a `]` this means we're closing a list, so:
    -   We get the current list (item on top of the stack)
    -   We get the parent list (item right after the top of the stack)
    -   We put the current list into its container list
    -   We remove the current list from the stack, as it's been closed
-   If we find a `[` or a `,` and we there's a current number, we add it to the current list
-   If we find a character representing a digit, we update the current number

Also, notice we initialise the lists stack with a fake empty list, to ensure all lists always have a parent list. This fake list is later removed.

Whether you use `eval` or not, once the input is parsed the solution is quite straight-forward, you just need basic recursion to compare the lists contents.

```js
const input = require("./input");

function solve(pairs) {
    let sumOfOrderedPairsPositions = 0;

    pairs.forEach((pair, index) => {
        const list1 = eval(pair[0]);
        const list2 = eval(pair[1]);

        if (compareLists(list1, list2) !== 1) {
            sumOfOrderedPairsPositions += index + 1;
        }
    });

    return sumOfOrderedPairsPositions;
}

function compareLists(list1, list2) {
    let compareResult = 0;

    let i = 0;

    while (i < list1.length && i < list2.length) {
        const item1 = list1[i];
        const item2 = list2[i];

        if (Array.isArray(item1) && Array.isArray(item2)) {
            compareResult = compareLists(item1, item2);
        } else if (Array.isArray(item1)) {
            compareResult = compareLists(item1, [item2]);
        } else if (Array.isArray(item2)) {
            compareResult = compareLists([item1], item2);
        } else {
            compareResult = Math.sign(item1 - item2);
        }

        if (compareResult !== 0) {
            return compareResult;
        }

        i++;
    }

    compareResult = Math.sign(list1.length - list2.length);

    return compareResult;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Create a list containing the lists in all pairs, and two extra lists: `[[2]]` and `[[6]]`.

Sort the lists inside that list from small to big.

Find the product of the positions of the two extra lists inside the sorted list.

### Solution

With the work done in the previous puzzle, this one becomes straight-forward.

```js
const input = require("./input");

function solve(pairs) {
    const extraList1 = [[2]];
    const extraList2 = [[6]];

    const allLists = [extraList1, extraList2];

    pairs.forEach((pair) => {
        const list1 = eval(pair[0]);
        const list2 = eval(pair[1]);

        allLists.push(list1, list2);
    });

    allLists.sort(compareLists);

    const extraList1Position = allLists.indexOf(extraList1) + 1;
    const extraList2Position = allLists.indexOf(extraList2) + 1;

    return extraList1Position * extraList2Position;
}

function compareLists(list1, list2) {
    let compareResult = 0;

    let i = 0;

    while (i < list1.length && i < list2.length) {
        const item1 = list1[i];
        const item2 = list2[i];

        if (Array.isArray(item1) && Array.isArray(item2)) {
            compareResult = compareLists(item1, item2);
        } else if (Array.isArray(item1)) {
            compareResult = compareLists(item1, [item2]);
        } else if (Array.isArray(item2)) {
            compareResult = compareLists([item1], item2);
        } else {
            compareResult = Math.sign(item1 - item2);
        }

        if (compareResult !== 0) {
            return compareResult;
        }

        i++;
    }

    compareResult = Math.sign(list1.length - list2.length);

    return compareResult;
}

console.log(solve(input));
```
