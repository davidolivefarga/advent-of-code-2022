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
