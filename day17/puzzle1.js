const input = require("./input");

const LEFT = { dx: -1, dy: 0 };
const RIGHT = { dx: 1, dy: 0 };
const DOWN = { dx: 0, dy: -1 };

const MIN_COLUMN = 1;
const MAX_COLUMN = 7;
const MIN_HEIGHT = 1;

const NUM_ROCKS = 2022;

function solve(instructions) {
    const blockedPositions = new Set();

    let currentHeight = 0;

    let rockCount = 0;
    let rockType = 0;
    let instructionIndex = 0;

    while (rockCount < NUM_ROCKS) {
        const rock = generateRock(rockType, currentHeight);

        while (true) {
            const instruction = instructions[instructionIndex];
            const direction = instruction === "<" ? LEFT : RIGHT;

            if (canMoveRock(rock, direction, blockedPositions)) {
                moveRock(rock, direction);
            }

            instructionIndex = (instructionIndex + 1) % instructions.length;

            if (canMoveRock(rock, DOWN, blockedPositions)) {
                moveRock(rock, DOWN);
            } else {
                break;
            }
        }

        rock.forEach(({ x, y }) => {
            blockedPositions.add(`${x}@${y}`);
            currentHeight = Math.max(currentHeight, y);
        });

        rockType = (rockType + 1) % 5;
        rockCount++;
    }

    return currentHeight;
}

function generateRock(rockType, maxY) {
    const rock = [];

    if (rockType === 0) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 5, y: maxY + 4 });
    } else if (rockType === 1) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 6 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 5 });
    } else if (rockType === 2) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 4, y: maxY + 6 });
    } else if (rockType === 3) {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 6 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 7 });
    } else {
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 2, y: maxY + 5 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 4 });
        rock.push({ x: MIN_COLUMN + 3, y: maxY + 5 });
    }

    return rock;
}

function canMoveRock(rock, direction, blockedPositions) {
    const { dx, dy } = direction;

    return rock.every(
        ({ x, y }) =>
            x + dx >= MIN_COLUMN &&
            x + dx <= MAX_COLUMN &&
            y + dy >= MIN_HEIGHT &&
            !blockedPositions.has(`${x + dx}@${y + dy}`)
    );
}

function moveRock(rock, direction) {
    const { dx, dy } = direction;

    rock.forEach((coordinate) => {
        coordinate.x += dx;
        coordinate.y += dy;
    });
}

console.log(solve(input));
