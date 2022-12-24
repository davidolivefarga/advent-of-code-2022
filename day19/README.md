# Day 19: Not Enough Minerals

You can find the puzzles [here](https://adventofcode.com/2022/day/19).

## ✍🏼 Input

A list of blueprints.

Each blueprint contains an `id` and the mineral cost of several robots, `oreRobotCost`, `clayRobotCost`, `obsidianRobotCost` and `geodeRobotCost`.

The `id` and all mineral costs are positive integers.

Example:

```js
const input = [
    {
        id: 1,
        oreRobotCost: { ore: 4 },
        clayRobotCost: { ore: 2 },
        obsidianRobotCost: { ore: 3, clay: 14 },
        geodeRobotCost: { ore: 2, obsidian: 7 },
    },
    {
        id: 2,
        oreRobotCost: { ore: 2 },
        clayRobotCost: { ore: 3 },
        obsidianRobotCost: { ore: 3, clay: 8 },
        geodeRobotCost: { ore: 3, obsidian: 12 },
    },
];
```

## 🧩 First puzzle

### Objective

Given a blueprint, you have `24` minutes to get as much geodes as possible.

On each minute:

-   At the beginning of the minute:
    -   You can decide to start building any type of robot if you have enough materials to do so.
-   At the end of the minute:
    -   You collect resources according to the number of robots (for example, if you have 3 ore robots, you obtain 3 ore).
    -   If you started building a robot, its construction is finished.

You always start with `1` ore robot.

The quality level of a blueprint is defined by the product of its `id` and the largest amount of geodes that it can collect.

Find the sum of the quality level of all blueprints in the list.

### Solution

This is a classic situation where you have different choices at the beginning of each minute, up to five depending on your resources:

-   Do nothing
-   Build an ore robot (if you have enough materials)
-   Build a clay robot (if you have enough materials)
-   Build an obsidian robot (if you have enough materials)
-   Build a geode robot (if you have enough materials)

Since you have a total of `24` minutes, there will a total of `~5^24` paths to follow (there will be less, but to get a sense on the magnitude), which will take forever. So the trick here is to find enough tricks to cut off the paths that don't make sense as soon as possible.

Here's the list of tricks I found:

1. If you have `1` minute left you can stop trying to build any robots, because even if you manage to build one it will not have time to collect anything.
2. Don't build more robots than you need. Since you can only build one robot at each minute and the material cost of each robot is known, the maximum amount of robots that we need will be bounded by those costs. For example, if the clay cost of the obsidian robot is `7`, having `7` clay robots will be enough, because this ensures that every round you will collect enough clay to cover any clay costs from any robot.
3. Instead of aimlessly making choices, put yourself the goal of building a certain type of robot. If you can build it, do it; otherwise, wait as many rounds as needed to gather enough resources to build it. This will speed up the process, because we can condense several minutes of waiting in one step.

With this in mind, the solution takes around `1` second to complete.

```js
const input = require("./input");

function solve(blueprints) {
    let totalQuality = 0;

    blueprints.forEach((blueprint) => {
        const maxGeodes = getMaxGeodes(blueprint);
        const blueprintQuality = blueprint.id * maxGeodes;

        totalQuality += blueprintQuality;
    });

    return totalQuality;
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
            timeLeft: 24,
        },
    ];

    while (scenarios.length > 0) {
        const scenario = scenarios.pop();

        maxGeodes = Math.max(
            maxGeodes,
            scenario.geodes + scenario.geodeRobots * scenario.timeLeft
        );

        if (scenario.timeLeft <= 1) {
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
```

## 🧩 Second puzzle

### Objective

Same rules as before, but now you have a total of `32` minutes.

Find the product of the the largest amount of geodes that we can collect with the first `3` blueprints.

### Solution

Initally I tried the same algorithm from the first puzzle, and it took around `15 seconds` to complete.

However, I was not happy with this solution and I tried thinking about other tricks, but I couldn't find anything. So I browsed other solutions until I found [this one](https://www.reddit.com/r/adventofcode/comments/zpihwi/comment/j0tls7a/?utm_source=share&utm_medium=web2x&context=3) from [@Boojum](https://www.reddit.com/user/Boojum/). The final trick that I was
missing is this one:

4. At any given point, you can calculate an optimistic bound of the maximum amount of geodes you will be able to obtain. In this optimistic scenario, you will assume you can build a geode robot at any given minute. So, in total, if you have `g` geodes, `gr` geode robots and `t` time left, you will collect:

    ```
    g + gr * t + (t - 1) + (t - 2) + ... + 1
    ```

    The `t - 1` part corresponds to the amount of geodes collected by the robot you will finish building at the end of the current minute, the `t-2` part corresponds to the amount of geodes collected by the robot you will finish building at the end of the next minute, and so on. This is a [well-known](https://en.wikipedia.org/wiki/1_%2B_2_%2B_3_%2B_4_%2B_%E2%8B%AF) sum, and the result is `(t - 1) * t / 2`.

    So, the maxmium theoretical amount of geodes you could possibly obtain is:

    ```
    g + gr * t + (t - 1) * t / 2
    ```

    If you iterate through the paths using a DFS, if at some path the maxmium theoretical amount of geodes you could possibly obtain is less than the maximum amount of geodes you found so far, you can safely discard this path.

I still don't fully understand why this trick is so powerful, but with it the solution only takes around `1` second to complete!

```js
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
```
