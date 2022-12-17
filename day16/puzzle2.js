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

console.time("foo");
console.log(solve(input));
console.timeEnd("foo");
