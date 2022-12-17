const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const valves = {};

rawInput
    .trim()
    .split(/\n/)
    .forEach((line) => {
        const lineParts = line.split(" ");

        const valveName = lineParts[1];
        const flow = Number(lineParts[4].match(/\d+/g));

        const connectedValves = lineParts
            .slice(9)
            .map((v) => v.replace(",", ""));

        valves[valveName] = { flow, connectedValves };
    });

module.exports = valves;
