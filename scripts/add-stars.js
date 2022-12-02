/**
 * Updates main README with stars for the specified day
 */

const fs = require("fs");
const https = require("https");
const path = require("path");

const dayNumber = process.argv[2];

const mainReadmePath = path.join(__dirname, "../README.md");
const mainReadme = fs.readFileSync(mainReadmePath).toString();

https.get(`https://adventofcode.com/2022/day/${dayNumber}`, (res) => {
    res.on("data", (data) => {
        const day = data.toString();
        const dayTitle = day.match(/<h2>--- (.*) ---<\/h2>/)[1];

        const stars = `\n| [${dayTitle}](./day${dayNumber}) | ⭐️ ⭐️ |\n`;

        const updatedMainReadme = mainReadme.trim() + stars;

        fs.writeFileSync(mainReadmePath, updatedMainReadme);
    });
});
