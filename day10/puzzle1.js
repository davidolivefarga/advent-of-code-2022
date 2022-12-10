const input = require("./input");

function solve(instructions) {
    let totalSignalStrength = 0;

    let cycle = 0;
    let cpuRegister = 1;

    const increaseCycle = () => {
        cycle++;

        if ((cycle - 20) % 40 === 0) {
            totalSignalStrength += cycle * cpuRegister;
        }
    };

    for (const [instruction, value] of instructions) {
        increaseCycle();

        if (instruction !== "noop") {
            increaseCycle();

            cpuRegister += value;
        }
    }

    return totalSignalStrength;
}

console.log(solve(input));
