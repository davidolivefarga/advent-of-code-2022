const input = require("./input");

function solve(treeHeights) {
    const rows = treeHeights.length;
    const cols = treeHeights[0].length;

    const scenicScores = Array.from({ length: rows }, () =>
        Array.from({ length: cols }).fill(1)
    );

    function iterate(row, col, direction) {
        const visitedTrees = [];

        visitedTrees.push({ height: Number.POSITIVE_INFINITY, treesBehind: 0 });

        let treesBehindCurrentTree = 0;

        while (row >= 0 && row < rows && col >= 0 && col < cols) {
            currentTreeHeight = treeHeights[row][col];

            while (
                visitedTrees[visitedTrees.length - 1].height < currentTreeHeight
            ) {
                visitedTrees.pop();
            }

            const visibleTreesBehindCurrentTree =
                treesBehindCurrentTree -
                visitedTrees[visitedTrees.length - 1].treesBehind;

            scenicScores[row][col] *= visibleTreesBehindCurrentTree;

            visitedTrees.push({
                height: currentTreeHeight,
                treesBehind: treesBehindCurrentTree,
            });

            row += direction[0];
            col += direction[1];

            treesBehindCurrentTree++;
        }
    }

    for (let row = 0; row < rows; row++) {
        iterate(row, 0, [0, 1]);
        iterate(row, cols - 1, [0, -1]);
    }

    for (let col = 0; col < cols; col++) {
        iterate(0, col, [1, 0]);
        iterate(rows - 1, col, [-1, 0]);
    }

    let maxScenicScore = Number.NEGATIVE_INFINITY;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            maxScenicScore = Math.max(maxScenicScore, scenicScores[row][col]);
        }
    }

    return maxScenicScore;
}

console.log(solve(input));
