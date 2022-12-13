const input = require("./input");

function solve(pairs) {
    let sumOfOrderedPairsIndices = 0;

    pairs.forEach(([rawList1, rawList2], index) => {
        const list1 = parseList(rawList1);
        const list2 = parseList(rawList2);

        if (isOrderedListPair(list1, list2) !== false) {
            sumOfOrderedPairsIndices += index + 1;
        }
    });

    return sumOfOrderedPairsIndices;
}

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

function isOrderedListPair(list1, list2) {
    let isOrdered = undefined;

    let i = 0;

    while (list1[i] !== undefined && list2[i] !== undefined) {
        const item1 = list1[i];
        const item2 = list2[i];

        if (Array.isArray(item1) && Array.isArray(item2)) {
            isOrdered = isOrderedListPair(item1, item2);
        } else if (Array.isArray(item1)) {
            isOrdered = isOrderedListPair(item1, [item2]);
        } else if (Array.isArray(item2)) {
            isOrdered = isOrderedListPair([item1], item2);
        } else if (item1 < item2) {
            isOrdered = true;
        } else if (item1 > item2) {
            isOrdered = false;
        }

        if (isOrdered !== undefined) {
            return isOrdered;
        }

        i++;
    }

    if (list1[i] !== undefined) {
        isOrdered = false;
    } else if (list2[i] !== undefined) {
        isOrdered = true;
    }

    return isOrdered;
}

console.log(solve(input));
