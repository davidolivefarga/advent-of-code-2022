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
