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
