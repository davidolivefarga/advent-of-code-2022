const input = require("./input");

function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    let start;
    let end;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === "S") {
                start = [r, c];
                grid[r][c] = "a".charCodeAt(0);
            } else if (grid[r][c] === "E") {
                end = [r, c];
                grid[r][c] = "z".charCodeAt(0);
            } else {
                grid[r][c] = grid[r][c].charCodeAt(0);
            }
        }
    }

    const visitedPositions = new Set();

    let currentPositions = [start];
    let steps = 0;

    while (currentPositions.length) {
        const nextPositions = [];

        for (const [r, c] of currentPositions) {
            if (r === end[0] && c === end[1]) {
                return steps;
            }

            const encodedPosition = `${r}@${c}`;

            if (visitedPositions.has(encodedPosition)) {
                continue;
            }

            visitedPositions.add(encodedPosition);

            if (r > 0 && grid[r - 1][c] <= grid[r][c] + 1) {
                nextPositions.push([r - 1, c]);
            }

            if (r < rows - 1 && grid[r + 1][c] <= grid[r][c] + 1) {
                nextPositions.push([r + 1, c]);
            }

            if (c > 0 && grid[r][c - 1] <= grid[r][c] + 1) {
                nextPositions.push([r, c - 1]);
            }

            if (c < cols - 1 && grid[r][c + 1] <= grid[r][c] + 1) {
                nextPositions.push([r, c + 1]);
            }
        }

        currentPositions = nextPositions;
        steps++;
    }
}

console.log(solve(input));
