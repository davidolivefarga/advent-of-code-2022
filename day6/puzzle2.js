const input = require("./input");

const WINDOW_SIZE = 14;

function solve(str) {
    const characterFrequencies = {};

    let uniqueCharactersCount = 0;

    for (let i = 0; i < str.length; i++) {
        const characterToRemove = str[i - WINDOW_SIZE];

        if (characterToRemove) {
            characterFrequencies[characterToRemove]--;

            if (characterFrequencies[characterToRemove] === 0) {
                uniqueCharactersCount--;
            }
        }

        const characterToAdd = str[i];

        if (!characterFrequencies[characterToAdd]) {
            characterFrequencies[characterToAdd] = 1;
            uniqueCharactersCount++;
        } else {
            characterFrequencies[characterToAdd]++;
        }

        if (uniqueCharactersCount === WINDOW_SIZE) {
            return i + 1;
        }
    }
}

console.log(solve(input));
