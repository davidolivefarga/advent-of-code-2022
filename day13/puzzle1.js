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
