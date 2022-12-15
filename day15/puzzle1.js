const input = require("./input");

const TARGET_ROW = 2000000;

function solve(sensorReadings) {
    const targetRowBeaconPositions = new Set();
    const targetRowReachableIntervals = [];

    for (const { sensor, beacon } of sensorReadings) {
        if (beacon.y === TARGET_ROW) {
            targetRowBeaconPositions.add(beacon.x);
        }

        const distanceToBeacon = getManhattanDistance(sensor, beacon);

        const yDistanceToTargetRow = Math.abs(sensor.y - TARGET_ROW);
        const xDistanceToTargetRow = distanceToBeacon - yDistanceToTargetRow;

        if (xDistanceToTargetRow > 0) {
            targetRowReachableIntervals.push({
                left: sensor.x - xDistanceToTargetRow,
                right: sensor.x + xDistanceToTargetRow,
            });
        }
    }

    let positionsWithoutBeacons = getIntervalsDistance(
        targetRowReachableIntervals
    );

    targetRowBeaconPositions.forEach((x) => {
        if (
            targetRowReachableIntervals.some(
                (interval) => x >= interval.left && x <= interval.right
            )
        ) {
            positionsWithoutBeacons--;
        }
    });

    return positionsWithoutBeacons;
}

function getManhattanDistance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function getIntervalsDistance(intervals) {
    intervals.sort((i1, i2) => i1.left - i2.left);

    let distance = 0;
    let previousInterval = intervals[0];

    for (let i = 1; i < intervals.length; i++) {
        const currentInterval = intervals[i];

        if (currentInterval.left <= previousInterval.right) {
            previousInterval.right = Math.max(
                previousInterval.right,
                currentInterval.right
            );
        } else {
            distance += getIntervalDistance(previousInterval);

            previousInterval = currentInterval;
        }
    }

    distance += getIntervalDistance(previousInterval);

    return distance;
}

function getIntervalDistance(interval) {
    return interval.right - interval.left + 1;
}

console.log(solve(input));
