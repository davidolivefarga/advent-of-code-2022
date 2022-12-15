const input = require("./input");

const MIN_COORDINATE_VALUE = 0;
const MAX_COORDINATE_VALUE = 4000000;

function solve(sensorReadings) {
    const sensors = sensorReadings.map(({ sensor, beacon }) => ({
        ...sensor,
        reach: getManhattanDistance(sensor, beacon),
    }));

    for (const sensor of sensors) {
        const distanceToCandidate = sensor.reach + 1;

        for (let dx = 0; dx <= distanceToCandidate; dx++) {
            const dy = distanceToCandidate - dx;

            const candidates = [
                { x: sensor.x + dx, y: sensor.y + dy },
                { x: sensor.x + dx, y: sensor.y - dy },
                { x: sensor.x - dx, y: sensor.y + dy },
                { x: sensor.x - dx, y: sensor.y - dy },
            ];

            for (const candidate of candidates) {
                if (isDistressBeacon(candidate, sensors)) {
                    return candidate.x * 4000000 + candidate.y;
                }
            }
        }
    }
}

function getManhattanDistance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function isDistressBeacon(candidate, sensors) {
    if (
        candidate.x < MIN_COORDINATE_VALUE ||
        candidate.x > MAX_COORDINATE_VALUE ||
        candidate.y < MIN_COORDINATE_VALUE ||
        candidate.y > MAX_COORDINATE_VALUE
    ) {
        return false;
    }

    for (const sensor of sensors) {
        const distanceToCandidate = getManhattanDistance(sensor, candidate);

        if (distanceToCandidate <= sensor.reach) {
            return false;
        }
    }

    return true;
}

console.log(solve(input));
