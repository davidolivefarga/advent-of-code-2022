const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput
    .trim()
    .split(/\n/)
    .map((line) => {
        const nums = line.match(/\d+/g).map(Number);
        const coordinates = [];

        for (let i = 0; i < nums.length; i += 2) {
            coordinates.push({ x: nums[i], y: nums[i + 1] });
        }

        return coordinates;
    });

module.exports = input;
