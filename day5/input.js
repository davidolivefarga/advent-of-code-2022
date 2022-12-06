const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

function parseInput(rawInput) {
    const [rawCrateStacks, rawInstructions] = rawInput
        .trimEnd()
        .split(/\n\n/)
        .map((str) => str.split(/\n/));

    const crateStacks = parseCrateStacks(rawCrateStacks);
    const instructions = parseInstructions(rawInstructions);

    return { crateStacks, instructions };
}

function parseCrateStacks(rawCrateStacks) {
    const crateStacks = [];
    const lastLineLength = rawCrateStacks[rawCrateStacks.length - 1].length;

    for (let i = 1; i < lastLineLength; i += 4) {
        const crateStack = [];

        for (let j = rawCrateStacks.length - 2; j >= 0; j--) {
            const crateId = rawCrateStacks[j][i];

            if (crateId && crateId != " ") {
                crateStack.push(crateId);
            }
        }

        crateStacks.push(crateStack);
    }

    return crateStacks;
}

function parseInstructions(rawInstructions) {
    return rawInstructions.map((instruction) => {
        const [amount, originStack, targetStack] = instruction
            .match(/\d+/g)
            .map(Number);

        return [amount, originStack - 1, targetStack - 1];
    });
}

module.exports = parseInput(rawInput);
