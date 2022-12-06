const { crateStacks, instructions } = require("./input");

function solve(crateStacks, instructions) {
    instructions.forEach((instruction) => {
        const [amount, originStack, targetStack] = instruction;

        for (let i = 0; i < amount; i++) {
            crateStacks[targetStack].push(crateStacks[originStack].pop());
        }
    });

    return crateStacks.map((crates) => crates.pop()).join("");
}

console.log(solve(crateStacks, instructions));
