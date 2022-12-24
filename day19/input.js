const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput
    .trim()
    .split("\n")
    .map((line) => {
        const nums = line.match(/\d+/g).map(Number);

        return {
            id: nums[0],
            oreRobotCost: { ore: nums[1] },
            clayRobotCost: { ore: nums[2] },
            obsidianRobotCost: { ore: nums[3], clay: nums[4] },
            geodeRobotCost: { ore: nums[5], obsidian: nums[6] },
        };
    });

module.exports = input;
