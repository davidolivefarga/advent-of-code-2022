const input = require("./input");

const DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
];

function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    const target = "a".charCodeAt(0);

    let start;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === "S") {
                grid[r][c] = "a";
            } else if (grid[r][c] === "E") {
                start = [r, c];
                grid[r][c] = "z";
            }

            grid[r][c] = grid[r][c].charCodeAt(0);
        }
    }

    const visited = Array.from({ length: rows }, () => new Array(cols));

    visited[start[0]][start[1]] = true;

    let positions = [start];
    let steps = 0;

    while (positions.length) {
        const nextPositions = [];

        for (const [r, c] of positions) {
            if (grid[r][c] === target) {
                return steps;
            }

            DIRECTIONS.forEach(([dr, dc]) => {
                const nr = r + dr;
                const nc = c + dc;

                if (
                    nr >= 0 &&
                    nr < rows &&
                    nc >= 0 &&
                    nc < cols &&
                    !visited[nr][nc] &&
                    grid[r][c] - grid[nr][nc] <= 1
                ) {
                    nextPositions.push([nr, nc]);
                    visited[nr][nc] = true;
                }
            });
        }

        positions = nextPositions;
        steps++;
    }
}

console.log(solve(input));
