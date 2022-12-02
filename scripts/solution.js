/**
 * Runs solution for the specified day and puzzle
 */

const { exec } = require("child_process");

const dayNumber = process.argv[2];
const puzzleNumber = process.argv[3];

exec(`node day${dayNumber}/puzzle${puzzleNumber}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error running solution: ${error}`);
        return;
    }

    stdout && console.log("Solution:", stdout);
    stderr && console.error("Error:", stderr);
});
