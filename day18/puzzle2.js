const input = require("./input");

const DIRECTIONS = [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
];

function solve(lavaCubes) {
    const lavaCubesSet = new Set();

    let minX = (minY = minZ = Number.POSITIVE_INFINITY);
    let maxX = (maxY = maxZ = Number.NEGATIVE_INFINITY);

    lavaCubes.forEach((lavaCube) => {
        const encodedLavaCube = lavaCube.toString();
        const [x, y, z] = lavaCube;

        lavaCubesSet.add(encodedLavaCube);

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
    });

    const initialWaterCube = [minX - 1, minY - 1, minZ - 1];

    const waterCubes = [initialWaterCube];
    const waterCubesSet = new Set(waterCubes);

    let totalSurface = 0;

    while (waterCubes.length > 0) {
        const waterCube = waterCubes.pop();
        const [x, y, z] = waterCube;

        DIRECTIONS.forEach(([dx, dy, dz]) => {
            const cube = [x + dx, y + dy, z + dz];
            const encodedCube = cube.toString();

            if (
                cube[0] < minX - 1 ||
                cube[0] > maxX + 1 ||
                cube[1] < minY - 1 ||
                cube[1] > maxY + 1 ||
                cube[2] < minZ - 1 ||
                cube[2] > maxZ + 1
            ) {
                return;
            }

            if (lavaCubesSet.has(encodedCube)) {
                totalSurface++;
            } else if (!waterCubesSet.has(encodedCube)) {
                waterCubesSet.add(encodedCube);
                waterCubes.push(cube);
            }
        });
    }

    return totalSurface;
}

console.log(solve(input));
