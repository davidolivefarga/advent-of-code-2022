# Day 15: Beacon Exclusion Zone

You can find the puzzles [here](https://adventofcode.com/2022/day/15).

## ✍🏼 Input

A list of data structures containing two objects, `sensor` and `beacon`.

Each of the objects is represented with an `x` and `y` coordinate.

Example:

```js
const input = [
    {
        sensor: {
            x: 2,
            y: 18,
        },
        beacon: {
            x: -2,
            y: 15,
        },
    },
    {
        sensor: {
            x: 9,
            y: 16,
        },
        beacon: {
            x: 10,
            y: 16,
        },
    },
];
```

## 🧩 First puzzle

### Objective

The distance between a `sensor` and a `beacon` is calculated by the [Manhattan distance](https://en.wikipedia.org/wiki/Taxicab_geometry) between them.

The `beacon` paired with a `sensor` is the first beacon that the sensor can detect. This means that if a sensor detects a beacon, you know there are no other beacons that close or closer to that sensor (it is guaranteed that there is never a tie where two beacons are the same distance to a sensor).

Once a `sensor` detects a `beacon` it locks into it. This means that it won't detect other beacons in a farther position.

Count the number of positions that cannot contain a beacon in the row where `y = 2000000`.

### Solution

This solution has three parts:

-   First, for each sensor we need to find the interval of positions that it can reach on the target row (if it exists).

    To do that, let `sensor = (sx, sy)` and `beacon = (bx, by)`:

    -   We calculate the reach of the sensor: `r = |sx - bx| + |sy - by|`
    -   We calculate the y-distance between the sensor and the target row: `dy = |sy - 2000000|`
    -   This means that the x-distance between the sensor and the target row will be `dx = r - dy`
    -   This means the interval will be `[sx - dx, sx + dx]`

-   Then, we count the number of positions covered by the previous intervals (i. e. their total distance).

    To do that, we sort the intervals by smallest `left`, pick the first interval and iterate through the others:

    -   If the next interval is overlapping the previous one, we merge them
    -   Otherwise, we add its distance and continue looping
    -   When we have one interval left, we add its distance

-   Finally, to the previous count we need subtract the positions that are already covered by beacons.

    To do that:

    -   We keep track of the x-position of all beacons with y-position `2000000`
    -   For each position, if it is contained in any of the intervals, we subtract it from the count

```js
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
```

## 🧩 Second puzzle

### Objective

There's a distress beacon in the area where the `x` and `y` coordinates are no lower than `0` and no larger than `4000000`.

The distress beacon position is the only position in that area that cannot be reached by any sensor.

The tuning frequency of the distress beacon is calculated as `4000000 * x + y`.

Find the tuning frequency of the distress beacon.

### Solution

Since there is only one position in the area that cannot be reached by any sensor, we know that the distress beacon must be just barely outside the reach of at least one of the sensors. This means that for at least one sensor, the distance between the sensor and the distress beacon will be its reach plus `1`.

With this in mind, the solution has two parts:

-   For each sensor, find the positions whose distance to the sensor will be the sensor reach plus `1`.

    These positions will be candidates for the distress beacon position.

    To do that, let `sensor = (sx, sy)` and `beacon = (bx, by)`:

    -   We calculate the reach of the sensor: `r = |sx - bx| + |sy - by|`
    -   We calculate the distance from the sensor to the candidates: `d = r + 1`
    -   We loop over all the values of `dx` and `dy` such that `dx + dy = d`
    -   Each of these `(dx, dy)` pairs gives us four candidates by alternating signs

-   For each candidate, we verify if it's the distress beacon.

    To do that:

    -   If the candidate is outside the distress beacon area, it is not the distress beacon
    -   If the candidate can be reached by any sensor, it is not the distress beacon
    -   Otherwise, we found the distress beacon and we're done

```js
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
```
