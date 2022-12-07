const input = require("./input");

function solve(terminalOutput) {
    const directoryContents = getDirectoryContents(terminalOutput);

    return Object.keys(directoryContents)
        .map((directory) => getDirectorySize(directory, directoryContents))
        .filter((directorySize) => directorySize < 100000)
        .reduce((acc, curr) => acc + curr, 0);
}

function getDirectoryContents(terminalOutputLines) {
    const directoryContents = {};

    let currentDirectoryPath = [];
    let currentDirectoryId;

    for (const line of terminalOutputLines) {
        if (line.startsWith("$ cd")) {
            const [, , newDirectory] = line.split(" ");

            if (newDirectory === "/") {
                currentDirectoryPath = ["/"];
            } else if (newDirectory === "..") {
                currentDirectoryPath.pop();
            } else {
                currentDirectoryPath.push(newDirectory);
            }

            currentDirectoryId = currentDirectoryPath.join("/");
        } else if (line !== "$ ls") {
            if (!directoryContents[currentDirectoryId]) {
                directoryContents[currentDirectoryId] = {
                    files: {},
                    directories: {},
                };
            }

            if (line.startsWith("dir")) {
                const [, directory] = line.split(" ");
                const directoryId = `${currentDirectoryId}/${directory}`;

                directoryContents[currentDirectoryId].directories[
                    directoryId
                ] = 0;
            } else {
                const [fileSize, file] = line.split(" ");

                directoryContents[currentDirectoryId].files[file] = +fileSize;
            }
        }
    }

    return directoryContents;
}

function getDirectorySize(directoryId, directoryContents) {
    let size = 0;

    const { directories, files } = directoryContents[directoryId];

    Object.values(files).forEach((fileSize) => (size += fileSize));
    Object.keys(directories).forEach(
        (dirId) => (size += getDirectorySize(dirId, directoryContents))
    );

    return size;
}

console.log(solve(input));
