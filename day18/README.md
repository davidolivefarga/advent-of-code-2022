# Day 18: Boiling Boulders

You can find the puzzles [here](https://adventofcode.com/2022/day/18).

## ✍🏼 Input

A list of `1 x 1 x 1` cubes, each cube given by its `(x, y, z)` position.

Example:

```js
const input = [
    [2, 2, 2],
    [1, 2, 2],
    [3, 2, 2],
    [2, 1, 2],
    [2, 3, 2],
];
```

## 🧩 First puzzle

### Objective

The cubes represent cubes of a lava droplet.

Find the surface area of the lava droplet.

### Solution

Each lava cube will have 6 sides, so we just need to count the number of sides that don't appear twice.

This can easily be done using a set structure, but how to identify the sides? Well, if we understand the `(x, y, z)` position as its center, then we can identify each side with the point in the center of the side. Since the cubes are `1 x 1 x 1`, these points will be:

-   Left side: `(x - 0.5, y, z)`
-   Right side: `(x + 0.5, y, z)`
-   Back side: `(x, y - 0.5, z)`
-   Front side: `(x, y + 0.5, z)`
-   Bottom side: `(x, y, z - 0.5)`
-   Top side: `(x, y, z + 0.5)`

```js
const input = require("./input");

function solve(lavaCubes) {
    const unconnectedSides = new Set();

    lavaCubes.forEach(([x, y, z]) => {
        const sides = [
            [x - 0.5, y, z],
            [x + 0.5, y, z],
            [x, y - 0.5, z],
            [x, y + 0.5, z],
            [x, y, z - 0.5],
            [x, y, z + 0.5],
        ];

        sides.forEach((side) => {
            const encodedSide = side.toString();

            if (unconnectedSides.has(encodedSide)) {
                unconnectedSides.delete(encodedSide);
            } else {
                unconnectedSides.add(encodedSide);
            }
        });
    });

    return unconnectedSides.size;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

The lava droplet is now inside a water mass, so only the exterior surface area of the lava droplet will be in contact with the water.

Find the exterior surface area of the lava droplet.

### Solution

The idea here is to start with a water cube that is touching the exterior surface of the lava droplet and then iterate through its neighbouring water cubes using a DFS (we could also use a BFS here, because the only thing we care about is to go through all the water cubes in contact with the exterior surface of the lava droplet).

We can start by finding the dimensions of the cuboid that contains all lava cubes, and extend it one unit on each direction. This will give us the region of cubes where all the water cubes in contact with the exterior surface of the lava droplet are contained.

Then, we grab a water cube inside that region and apply the DFS algorithm through all the water cubes in the region. As soon as we find a cube of water touching a cube of lava, we can increase the exterior surface area of the lava droplet by one.

```js
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
```
