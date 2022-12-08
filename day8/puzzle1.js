const input = require("./input");

function solve(treeHeights) {
    const rows = treeHeights.length;
    const cols = treeHeights[0].length;

    const visibleTrees = new Set();

    function iterate(row, col, direction) {
        let maxTreeHeight = Number.NEGATIVE_INFINITY;

        while (row >= 0 && row < rows && col >= 0 && col < cols) {
            if (treeHeights[row][col] > maxTreeHeight) {
                maxTreeHeight = treeHeights[row][col];
                visibleTrees.add(`${row}@${col}`);
            }

            row += direction[0];
            col += direction[1];
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

    return visibleTrees.size;
}

console.log(solve(input));
