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
