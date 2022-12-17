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
