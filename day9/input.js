const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput
    .trim()
    .split(/\n/)
    .map((line) => {
        const [directionName, steps] = line.split(" ");

        return [directionName, Number(steps)];
    });

module.exports = input;
