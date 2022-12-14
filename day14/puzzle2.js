const input = require("./input");

function solve(rockPaths) {
    const blockedTiles = new Set();

    const blockTile = (x, y) => blockedTiles.add(`${x}@${y}`);
    const isTileBlocked = (x, y) => blockedTiles.has(`${x}@${y}`);

    let rockTilesMaxY = Number.NEGATIVE_INFINITY;

    for (const rockPath of rockPaths) {
        for (let i = 1; i < rockPath.length; i++) {
            const start = rockPath[i - 1];
            const end = rockPath[i];

            const minX = Math.min(start.x, end.x);
            const maxX = Math.max(start.x, end.x);
            const minY = Math.min(start.y, end.y);
            const maxY = Math.max(start.y, end.y);

            rockTilesMaxY = Math.max(rockTilesMaxY, maxY);

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    blockTile(x, y);
                }
            }
        }
    }

    let restingSandTiles = 0;

    while (true) {
        const sandTile = { x: 500, y: 0 };

        while (sandTile.y < rockTilesMaxY + 1) {
            if (!isTileBlocked(sandTile.x, sandTile.y + 1)) {
                sandTile.y++;
            } else if (!isTileBlocked(sandTile.x - 1, sandTile.y + 1)) {
                sandTile.x--;
                sandTile.y++;
            } else if (!isTileBlocked(sandTile.x + 1, sandTile.y + 1)) {
                sandTile.x++;
                sandTile.y++;
            } else {
                break;
            }
        }

        if (sandTile.x === 500 && sandTile.y === 0) {
            return restingSandTiles + 1;
        }

        blockTile(sandTile.x, sandTile.y);

        restingSandTiles++;
    }
}

console.log(solve(input));
