const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput
    .trim()
    .split(/\n/)
    .map((line) => {
        const nums = line.match(/-?\d+/g).map(Number);

        const sensor = { x: nums[0], y: nums[1] };
        const beacon = { x: nums[2], y: nums[3] };

        return { sensor, beacon };
    });

module.exports = input;
