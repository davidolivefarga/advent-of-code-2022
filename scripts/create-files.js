/**
 * Creates folder and files for the specified day
 */

const fs = require("fs");
const https = require("https");

require("dotenv").config();

// This value can be found inspecting Network requests to Advent of Code
const sessionCookie = process.env.AOC_SESSION_COOKIE;

const dayNumber = process.argv[2];

const folderName = `day${dayNumber}`;

fs.mkdirSync(folderName);

fs.writeFileSync(`${folderName}/input.js`, createInputSkeleton());
fs.writeFileSync(`${folderName}/puzzle1.js`, createPuzzleSkeleton());
fs.writeFileSync(`${folderName}/puzzle2.js`, createPuzzleSkeleton());

https.get(`https://adventofcode.com/2022/day/${dayNumber}`, (res) => {
    res.on("data", (data) => {
        const day = data.toString();
        const dayTitle = day.match(/<h2>--- (.*) ---<\/h2>/)[1];

        fs.writeFileSync(
            `${folderName}/README.md`,
            createReadmeSkeleton(dayNumber, dayTitle)
        );
    });
});

https.get(
    `https://adventofcode.com/2022/day/${dayNumber}/input`,
    {
        headers: {
            Cookie: `session=${sessionCookie}`,
        },
    },
    (res) => {
        res.on("data", (data) => {
            const input = data.toString();

            fs.writeFileSync(`${folderName}/input.txt`, input);
        });
    }
);

function createInputSkeleton() {
    return formatText(
        `
        const fs = require("fs");
        const path = require("path");

        const rawInputPath = path.join(__dirname, "input.txt");
        const rawInput = fs.readFileSync(rawInputPath, "utf8");

        const input = rawInput.trim();

        module.exports = input;
        `
    );
}

function createPuzzleSkeleton() {
    return formatText(
        `
        const input = require("./input");
        `
    );
}

function createReadmeSkeleton(dayNumber, dayTitle) {
    return formatText(
        `
        # ${dayTitle}

        You can find the puzzles [here](https://adventofcode.com/2022/day/${dayNumber}).

        ## ✍🏼 Input

        TODO: Add input description

        Example:

        \`\`\`js
        // TODO: Add input example
        \`\`\`

        ## 🧩 First puzzle

        ### Objective

        TODO: Add first puzzle objective

        ### Solution

        TODO: Add first puzzle solution explanation

        \`\`\`js
        // TODO: Add first puzzle solution
        \`\`\`

        ## 🧩 Second puzzle

        ### Objective

        TODO: Add second puzzle objective

        ### Solution

        TODO: Add second puzzle solution explanation

        \`\`\`js
        // TODO: Add second puzzle solution
        \`\`\`
        `
    );
}

function formatText(text) {
    const textRows = text
        .split("\n")
        // Removing the first row because we don't want
        // an empty line at the beginning of the file
        .slice(1)
        .map((r) => r.trim());

    return textRows.join("\n");
}
