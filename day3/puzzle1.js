const input = require("./input");

function solve(rucksacks) {
    return rucksacks.reduce((totalPriority, rucksack) => {
        const firstContainer = rucksack.slice(0, rucksack.length / 2);
        const secondContainer = rucksack.slice(rucksack.length / 2);

        const firstContainerItems = new Set(firstContainer);

        for (const item of secondContainer) {
            if (firstContainerItems.has(item)) {
                if (item === item.toLowerCase()) {
                    return totalPriority + item.charCodeAt(0) - 96;
                } else {
                    return totalPriority + item.charCodeAt(0) - 38;
                }
            }
        }
    }, 0);
}

console.log(solve(input));
