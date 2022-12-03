const input = require("./input");

function solve(rucksacks) {
    let totalPriority = 0;

    for (let i = 0; i < rucksacks.length; i += 3) {
        const firstRucksackItems = new Set(rucksacks[i]);
        const secondRucksackItems = new Set(rucksacks[i + 1]);

        const thirdRucksack = rucksacks[i + 2];

        for (const item of thirdRucksack) {
            if (firstRucksackItems.has(item) && secondRucksackItems.has(item)) {
                if (item === item.toLowerCase()) {
                    totalPriority += item.charCodeAt(0) - 96;
                } else {
                    totalPriority += item.charCodeAt(0) - 38;
                }

                break;
            }
        }
    }

    return totalPriority;
}

console.log(solve(input));
