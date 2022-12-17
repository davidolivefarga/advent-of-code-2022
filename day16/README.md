# Day 16: Proboscidea Volcanium

You can find the puzzles [here](https://adventofcode.com/2022/day/16).

## ✍🏼 Input

A map of valves, each valve represented as an object with:

-   `flow`: either a positive integer or 0
-   `connectedValves`: a list of strings representing other valves

Example:

```js
const input = {
    AA: {
        flow: 0,
        connectedValves: ["DD", "BB"],
    },
    BB: {
        flow: 13,
        connectedValves: ["CC", "AA"],
    },
    CC: {
        flow: 2,
        connectedValves: ["DD", "BB"],
    },
    DD: {
        flow: 2,
        connectedValves: ["DD", "BB"],
    },
};
```

## 🧩 First puzzle

### Objective

Initially all valves are closed.

From any given valve, you can spend `1` minute to:

-   Open the valve
-   Move to a valve that is connected to the current valve

After you open a valve, it starts building pressure according to its `flow` until your time is over (for example, if you have `29` minutes left, you can spend `1` minute to open a valve with flow `flow`; since you have `28` minutes left, this will generate a total pressure of `28 * flow`).

Find the maximum pressure you can achieve after `30` minutes, starting at valve `AA`.

### Solution

The main idea is to simulate all possible scenarios and keep track of the maximum pressure found so far.

A scenario can be described as:

-   `currentValve`: the valve we're in
-   `timeLeft`: the time we have left
-   `pressure`: the pressure we accumulated so far
-   `closedValves`: the list of valves that are still closed

Then, from any given scenario:

-   If we can't activate any closed valve (because there is no time left, because there are no more closed valves or because all the closed valves are too far), then this scenario is finished, so we just need to get the pressure we built so far and then update the maximum pressure if needed.
-   Otherwise, for any closed valve that we can activate, we move to the closed valve and activate it. This will generate a new scenario that we need to add to the list of scensrios pending to evaluate evaluate.

However, if you simulate the scenarios just like this, it will take a lot of time to finish, so you need to come up with some clever optimizations to reduce that time.

This is the list of optimizations I came up with:

1.  Some of the valves have a `flow` of `0`, so we can ignore them when looking at the closed valves that haven't been opened yet
2.  Given a scenario, for each closed valve we want to see if it's reachable or not. We could compute the distance from the current valve to the closed valve on the spot, but we would end up repeating a lot of these distances, so we can precalculate them.
3.  As we simulate scenarios, we will repeat them over and over. For example, suppose that `AA` is connected to `BB` and `CC`. If you're at valve `AA`, you can move to `BB` and come back or move to `CC` and come back. In both cases, you will end up in `AA` with the same time left, the same accumulated pressure and the same list of closed valves. So, we need to keep track of the visited scenarios to avoid going through them multiple times. To do that, we can encode the scenarios as a string and store them in a set.

With these optimizations, **the solution takes around `0.5` seconds to complete**.

```js
const input = require("./input");

function solve(valves) {
    const valveDistances = buildValveDistances(valves);

    const initialScenario = {
        currentValve: "AA",
        timeLeft: 30,
        pressure: 0,
        closedValves: Object.keys(valves).filter((v) => valves[v].flow > 0),
    };

    return getMaxPressure(initialScenario, valves, valveDistances);
}

function buildValveDistances(valves) {
    const valveDistances = {};

    Object.keys(valves).forEach((valve) => (valveDistances[valve] = {}));

    Object.entries(valves).forEach(([valve, { connectedValves }]) => {
        const visitedValves = new Set([valve]);

        let currentValves = connectedValves;
        let currentDistance = 1;

        while (currentValves.length > 0) {
            const nextValves = [];

            for (const v of currentValves) {
                if (visitedValves.has(v)) {
                    continue;
                }

                visitedValves.add(v);

                valveDistances[valve][v] = currentDistance;

                valves[v].connectedValves.forEach((cv) => {
                    if (!visitedValves.has(cv)) {
                        nextValves.push(cv);
                    }
                });
            }

            currentValves = nextValves;
            currentDistance++;
        }
    });

    return valveDistances;
}

function getMaxPressure(initialScenario, valves, valveDistances) {
    let maxPressure = 0;

    const currentScenarios = [initialScenario];
    const visitedScenarios = new Set();

    while (currentScenarios.length) {
        const scenario = currentScenarios.pop();

        visitedScenarios.add(encodeScenario(scenario));

        if (!canActivateAnyClosedValve(scenario, valveDistances)) {
            maxPressure = Math.max(maxPressure, scenario.pressure);

            continue;
        }

        scenario.closedValves.forEach((closedValve) => {
            if (canActivateClosedValve(scenario, closedValve, valveDistances)) {
                const newScenario = activateClosedValve(
                    scenario,
                    closedValve,
                    valves,
                    valveDistances
                );

                if (!visitedScenarios.has(encodeScenario(newScenario))) {
                    currentScenarios.push(newScenario);
                }
            }
        });
    }

    return maxPressure;
}

function canActivateAnyClosedValve(scenario, valveDistances) {
    const { closedValves } = scenario;

    return closedValves.some((v) =>
        canActivateClosedValve(scenario, v, valveDistances)
    );
}

function canActivateClosedValve(scenario, closedValve, valveDistances) {
    const { currentValve, timeLeft } = scenario;

    return timeLeft - valveDistances[currentValve][closedValve] - 1 >= 0;
}

function activateClosedValve(scenario, closedValve, valves, valveDistances) {
    const { currentValve, timeLeft, closedValves, pressure } = scenario;

    const timeSpentToOpenValve = valveDistances[currentValve][closedValve] + 1;
    const newTimeLeft = timeLeft - timeSpentToOpenValve;

    const newScenario = {
        currentValve: closedValve,
        timeLeft: newTimeLeft,
        pressure: pressure + newTimeLeft * valves[closedValve].flow,
        closedValves: closedValves.filter((v) => v !== closedValve),
    };

    return newScenario;
}

function encodeScenario(scenario) {
    const codeParts = [];

    codeParts.push(scenario.currentValve);
    codeParts.push(scenario.timeLeft);
    codeParts.push(scenario.pressure);

    const closedValves = Array.from(scenario.closedValves);

    closedValves.sort();
    closedValves.forEach((valve) => codeParts.push(valve));

    return codeParts.join(",");
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same situation as before, but this time there are two players moving through the valves.

Find the maximum pressure you can achieve after `26` minutes, with both players starting at valve `AA`.

### Solution

The key idea here is to understand that even though both players move at the same time, the sets of valves that each them will open is disjoint (that is, if the first player opens valve `AA`, the second player won't open it). This lets us simulate their movements in separate steps:

1. First, we simulate the movement of the first player. This will give us a list of scenarios where the first player has finished moving and has obtained some accumulated pressure and has opened some closed valves.
2. Then, for each of the above scenarios, we can simulate the movement of the second player but taking into account the valves that were opened by the first user. That is, the initial scenario of the second player will the same as the one for the first player, but its list of closed valves will be the original list of closed valves minus the valves opened by the first player.
3. Finally, we calculate the maximum pressure than can be obtained by the second player in each of the first player scenarios, and we compute the total maximum pressure that we can obtain between both players.

However, if we implement this solution, it will take too much time, even if we add the optimizations from the previous solution.

We need one more optimization in step 1), because we don't need all possible scenarios that the first player can generate. For example, consider the group of scenarios that end up opening valves `AA`, `BB` and `CC`. The first player might follow different paths to do this: `AA - BB - CC`, `AA - CC - BB`, etc. However, from all these paths, there will be one that maximises the pressure than can be obtained by opening these valves. Since we want to maximise the total pressure, that is the only path we care about. In other words, from all the scenarios that open a given set of valves, we only care about the one that maximises pressure. Hence, we just need to keep track of the best pressure we can obtain for any given set of opened valves.

With these optimizations, **the solution takes around `30` seconds to complete**.

```js
const input = require("./input");

function solve(valves) {
    const valveDistances = buildValveDistances(valves);

    const firstPlayerInitialScenario = {
        currentValve: "AA",
        timeLeft: 26,
        pressure: 0,
        closedValves: Object.keys(valves).filter((v) => valves[v].flow > 0),
    };

    const maxPressureByClosedValvesAfterFirstPlayerMoves =
        getMaxPressureByClosedValves(
            firstPlayerInitialScenario,
            valves,
            valveDistances
        );

    let maxPressureAfterBothPlayersMoved = 0;

    Object.entries(maxPressureByClosedValvesAfterFirstPlayerMoves).forEach(
        ([encodedClosedValves, firstPlayerPressure]) => {
            const closedValves = decodeClosedValves(encodedClosedValves);

            const secondPlayerInitialScenario = {
                currentValve: "AA",
                timeLeft: 26,
                pressure: 0,
                closedValves,
            };

            const secondPlayerPressure = getMaxPressure(
                secondPlayerInitialScenario,
                valves,
                valveDistances
            );

            maxPressureAfterBothPlayersMoved = Math.max(
                maxPressureAfterBothPlayersMoved,
                firstPlayerPressure + secondPlayerPressure
            );
        }
    );

    return maxPressureAfterBothPlayersMoved;
}

function buildValveDistances(valves) {
    const valveDistances = {};

    Object.keys(valves).forEach((valve) => (valveDistances[valve] = {}));

    Object.entries(valves).forEach(([valve, { connectedValves }]) => {
        const visitedValves = new Set([valve]);

        let currentValves = connectedValves;
        let currentDistance = 1;

        while (currentValves.length > 0) {
            const nextValves = [];

            for (const v of currentValves) {
                if (visitedValves.has(v)) {
                    continue;
                }

                visitedValves.add(v);

                valveDistances[valve][v] = currentDistance;

                valves[v].connectedValves.forEach((cv) => {
                    if (!visitedValves.has(cv)) {
                        nextValves.push(cv);
                    }
                });
            }

            currentValves = nextValves;
            currentDistance++;
        }
    });

    return valveDistances;
}

function getMaxPressureByClosedValves(initialScenario, valves, valveDistances) {
    const maxPressureByClosedValves = {};

    const currentScenarios = [initialScenario];
    const visitedScenarios = new Set();

    while (currentScenarios.length) {
        const scenario = currentScenarios.pop();

        visitedScenarios.add(encodeScenario(scenario));

        const encodedClosedValves = encodeClosedValves(scenario.closedValves);

        if (!maxPressureByClosedValves[encodedClosedValves]) {
            maxPressureByClosedValves[encodedClosedValves] = scenario.pressure;
        } else {
            maxPressureByClosedValves[encodedClosedValves] = Math.max(
                maxPressureByClosedValves[encodedClosedValves],
                scenario.pressure
            );
        }

        if (!canActivateAnyClosedValve(scenario, valveDistances)) {
            continue;
        }

        scenario.closedValves.forEach((closedValve) => {
            if (canActivateClosedValve(scenario, closedValve, valveDistances)) {
                const newScenario = activateClosedValve(
                    scenario,
                    closedValve,
                    valves,
                    valveDistances
                );

                if (!visitedScenarios.has(encodeScenario(newScenario))) {
                    currentScenarios.push(newScenario);
                }
            }
        });
    }

    return maxPressureByClosedValves;
}

function getMaxPressure(initialScenario, valves, valveDistances) {
    let maxPressure = 0;

    const currentScenarios = [initialScenario];
    const visitedScenarios = new Set();

    while (currentScenarios.length) {
        const scenario = currentScenarios.pop();

        visitedScenarios.add(encodeScenario(scenario));

        if (!canActivateAnyClosedValve(scenario, valveDistances)) {
            maxPressure = Math.max(maxPressure, scenario.pressure);

            continue;
        }

        scenario.closedValves.forEach((closedValve) => {
            if (canActivateClosedValve(scenario, closedValve, valveDistances)) {
                const newScenario = activateClosedValve(
                    scenario,
                    closedValve,
                    valves,
                    valveDistances
                );

                if (!visitedScenarios.has(encodeScenario(newScenario))) {
                    currentScenarios.push(newScenario);
                }
            }
        });
    }

    return maxPressure;
}

function canActivateAnyClosedValve(scenario, valveDistances) {
    const { closedValves } = scenario;

    return closedValves.some((v) =>
        canActivateClosedValve(scenario, v, valveDistances)
    );
}

function canActivateClosedValve(scenario, closedValve, valveDistances) {
    const { currentValve, timeLeft } = scenario;

    return timeLeft - valveDistances[currentValve][closedValve] - 1 >= 0;
}

function activateClosedValve(scenario, closedValve, valves, valveDistances) {
    const { currentValve, timeLeft, closedValves, pressure } = scenario;

    const timeSpentToOpenValve = valveDistances[currentValve][closedValve] + 1;
    const newTimeLeft = timeLeft - timeSpentToOpenValve;

    const newScenario = {
        currentValve: closedValve,
        timeLeft: newTimeLeft,
        pressure: pressure + newTimeLeft * valves[closedValve].flow,
        closedValves: closedValves.filter((v) => v !== closedValve),
    };

    return newScenario;
}

function encodeScenario(scenario) {
    const codeParts = [];

    codeParts.push(scenario.currentValve);
    codeParts.push(scenario.timeLeft);
    codeParts.push(scenario.pressure);
    codeParts.push(encodeClosedValves(scenario.closedValves));

    return codeParts.join(",");
}

function encodeClosedValves(closedValves) {
    closedValves.sort();

    return closedValves.join(",");
}

function decodeClosedValves(encodedClosedValves) {
    return encodedClosedValves.split(",");
}

console.log(solve(input));
```
