const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const monkeys = {};

rawInput
    .trim()
    .split(/\n/)
    .forEach((line) => {
        const [monkeyName, monkeyData] = line.split(": ");
        const monkeyDataParts = monkeyData.split(" ");

        if (monkeyDataParts.length === 1) {
            monkeys[monkeyName] = Number(monkeyDataParts[0]);
        } else {
            monkeys[monkeyName] = monkeyDataParts;
        }
    });

module.exports = monkeys;
