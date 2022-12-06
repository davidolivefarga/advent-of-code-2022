const { crateStacks, instructions } = require("./input");

function solve(crateStacks, instructions) {
    instructions.forEach((instruction) => {
        const [amount, originStack, targetStack] = instruction;

        const cratesToMove = crateStacks[originStack].splice(-amount, amount);

        crateStacks[targetStack].push(...cratesToMove);
    });

    return crateStacks.map((crates) => crates.pop()).join("");
}

console.log(solve(crateStacks, instructions));
