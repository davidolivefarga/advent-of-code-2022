const input = require("./input");

const DIRECTIONS = {
    U: [0, 1],
    D: [0, -1],
    L: [-1, 0],
    R: [1, 0],
};

function solve(instructions) {
    const positionsVisitedByTail = new Set();

    const knots = Array.from({ length: 10 }, () => [0, 0]);

    positionsVisitedByTail.add(encodeKnot(knots[knots.length - 1]));

    instructions.forEach(([directionName, steps]) => {
        const direction = DIRECTIONS[directionName];

        for (let i = 0; i < steps; i++) {
            moveKnot(knots[0], direction);

            for (let j = 1; j < knots.length; j++) {
                const currKnot = knots[j];
                const prevKnot = knots[j - 1];

                if (areKnotsTouching(currKnot, prevKnot)) {
                    break;
                }

                moveKnot(currKnot, getNormalizedDirection(currKnot, prevKnot));
            }

            positionsVisitedByTail.add(encodeKnot(knots[knots.length - 1]));
        }
    });

    return positionsVisitedByTail.size;
}

function encodeKnot(knot) {
    return `${knot[0]}@${knot[1]}`;
}

function areKnotsTouching(knot1, knot2) {
    return (
        Math.abs(knot1[0] - knot2[0]) < 2 && Math.abs(knot1[1] - knot2[1]) < 2
    );
}

function moveKnot(knot, direction) {
    knot[0] += direction[0];
    knot[1] += direction[1];
}

function getNormalizedDirection(originKnot, targetKnot) {
    return [
        (targetKnot[0] - originKnot[0]) /
            (Math.abs(targetKnot[0] - originKnot[0]) || 1),
        (targetKnot[1] - originKnot[1]) /
            (Math.abs(targetKnot[1] - originKnot[1]) || 1),
    ];
}

console.log(solve(input));
