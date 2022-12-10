const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput
    .trim()
    .split(/\n/)
    .map((line) => {
        const [instruction, value] = line.split(" ");

        if (instruction === "noop") {
            return [instruction];
        }

        return [instruction, Number(value)];
    });

module.exports = input;
