const input = require("./input");

function solve(blueprints) {
    let maxGeodesProduct = 1;

    blueprints.slice(0, 3).forEach((blueprint) => {
        const maxGeodes = getMaxGeodes(blueprint);

        console.log(maxGeodes);

        maxGeodesProduct *= maxGeodes;
    });

    return maxGeodesProduct;
}

function getMaxGeodes(blueprint) {
    let maxGeodes = 0;

    const maxOreRobotsNeeded = Math.max(
        blueprint.oreRobotCost.ore,
        blueprint.clayRobotCost.ore,
        blueprint.obsidianRobotCost.ore,
        blueprint.geodeRobotCost.ore
    );
    const maxClayRobotsNeeded = blueprint.obsidianRobotCost.clay;
    const maxObsidianRobotsNeeded = blueprint.geodeRobotCost.obsidian;

    const scenarios = [
        {
            ore: 0,
            oreRobots: 1,
            clay: 0,
            clayRobots: 0,
            obsidian: 0,
            obsidianRobots: 0,
            geodes: 0,
            geodeRobots: 0,
            timeLeft: 32,
        },
    ];

    while (scenarios.length > 0) {
        const scenario = scenarios.pop();

        maxGeodes = Math.max(
            maxGeodes,
            scenario.geodes + scenario.geodeRobots * scenario.timeLeft
        );

        if (
            scenario.timeLeft <= 1 ||
            maxTheoreticalGeodes(scenario) <= maxGeodes
        ) {
            continue;
        }

        if (
            scenario.oreRobots < maxOreRobotsNeeded &&
            canBuildOreRobot(scenario, blueprint)
        ) {
            scenarios.push(buildOreRobot(scenario, blueprint));
        }

        if (
            scenario.clayRobots < maxClayRobotsNeeded &&
            canBuildClayRobot(scenario, blueprint)
        ) {
            scenarios.push(buildClayRobot(scenario, blueprint));
        }

        if (
            scenario.obsidianRobots < maxObsidianRobotsNeeded &&
            canBuildObsidianRobot(scenario, blueprint)
        ) {
            scenarios.push(buildObsidianRobot(scenario, blueprint));
        }

        if (canBuildGeodeRobot(scenario, blueprint)) {
            scenarios.push(buildGeodeRobot(scenario, blueprint));
        }
    }

    return maxGeodes;
}

function maxTheoreticalGeodes(scenario) {
    const { geodes, geodeRobots, timeLeft } = scenario;

    return geodes + geodeRobots * timeLeft + (timeLeft * (timeLeft - 1)) / 2;
}

function canBuildOreRobot(scenario, blueprint) {
    return (
        blueprint.oreRobotCost.ore <=
        scenario.ore + scenario.oreRobots * (scenario.timeLeft - 2)
    );
}

function canBuildClayRobot(scenario, blueprint) {
    return (
        blueprint.clayRobotCost.ore <=
        scenario.ore + scenario.oreRobots * (scenario.timeLeft - 2)
    );
}

function canBuildObsidianRobot(scenario, blueprint) {
    return (
        blueprint.obsidianRobotCost.ore <=
            scenario.ore + scenario.oreRobots * (scenario.timeLeft - 2) &&
        blueprint.obsidianRobotCost.clay <=
            scenario.clay + scenario.clayRobots * (scenario.timeLeft - 2)
    );
}

function canBuildGeodeRobot(scenario, blueprint) {
    return (
        blueprint.geodeRobotCost.ore <=
            scenario.ore + scenario.oreRobots * (scenario.timeLeft - 2) &&
        blueprint.geodeRobotCost.obsidian <=
            scenario.obsidian +
                scenario.obsidianRobots * (scenario.timeLeft - 2)
    );
}

function buildOreRobot(scenario, blueprint) {
    const newScenario = { ...scenario };

    while (newScenario.ore < blueprint.oreRobotCost.ore) {
        spendMinute(newScenario);
    }

    spendMinute(newScenario);

    newScenario.ore -= blueprint.oreRobotCost.ore;
    newScenario.oreRobots++;

    return newScenario;
}

function buildClayRobot(scenario, blueprint) {
    const newScenario = { ...scenario };

    while (newScenario.ore < blueprint.clayRobotCost.ore) {
        spendMinute(newScenario);
    }

    spendMinute(newScenario);

    newScenario.ore -= blueprint.clayRobotCost.ore;
    newScenario.clayRobots++;

    return newScenario;
}

function buildObsidianRobot(scenario, blueprint) {
    const newScenario = { ...scenario };

    while (
        newScenario.ore < blueprint.obsidianRobotCost.ore ||
        newScenario.clay < blueprint.obsidianRobotCost.clay
    ) {
        spendMinute(newScenario);
    }

    spendMinute(newScenario);

    newScenario.ore -= blueprint.obsidianRobotCost.ore;
    newScenario.clay -= blueprint.obsidianRobotCost.clay;
    newScenario.obsidianRobots++;

    return newScenario;
}

function buildGeodeRobot(scenario, blueprint) {
    const newScenario = { ...scenario };

    while (
        newScenario.ore < blueprint.geodeRobotCost.ore ||
        newScenario.obsidian < blueprint.geodeRobotCost.obsidian
    ) {
        spendMinute(newScenario);
    }

    spendMinute(newScenario);

    newScenario.ore -= blueprint.geodeRobotCost.ore;
    newScenario.obsidian -= blueprint.geodeRobotCost.obsidian;
    newScenario.geodeRobots++;

    return newScenario;
}

function spendMinute(scenario) {
    scenario.ore += scenario.oreRobots;
    scenario.clay += scenario.clayRobots;
    scenario.obsidian += scenario.obsidianRobots;
    scenario.geodes += scenario.geodeRobots;

    scenario.timeLeft--;
}

console.log(solve(input));
