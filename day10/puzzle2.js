const input = require("./input");

function solve(instructions) {
    let image = "";

    let cycle = 0;
    let cpuRegister = 1;

    const increaseCycle = () => {
        cycle++;

        const pixelRowPosition = (cycle - 1) % 40;

        if (
            pixelRowPosition >= cpuRegister - 1 &&
            pixelRowPosition <= cpuRegister + 1
        ) {
            image += "#";
        } else {
            image += ".";
        }

        if (cycle % 40 === 0) {
            image += "\n";
        }
    };

    for (const [instruction, value] of instructions) {
        increaseCycle();

        if (instruction !== "noop") {
            increaseCycle();

            cpuRegister += value;
        }
    }

    return image;
}

console.log(solve(input));
