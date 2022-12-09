const input = require("./input");

const DIRECTIONS = {
    U: [0, 1],
    D: [0, -1],
    L: [-1, 0],
    R: [1, 0],
};

function solve(instructions) {
    const positionsVisitedByTail = new Set();

    let head = [0, 0];
    let tail = [0, 0];

    positionsVisitedByTail.add(encodeKnot(tail));

    instructions.forEach(([directionName, steps]) => {
        const direction = DIRECTIONS[directionName];

        for (let i = 0; i < steps; i++) {
            const newHead = [head[0] + direction[0], head[1] + direction[1]];

            if (!areKnotsTouching(newHead, tail)) {
                tail = head;

                positionsVisitedByTail.add(encodeKnot(tail));
            }

            head = newHead;
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

console.log(solve(input));
