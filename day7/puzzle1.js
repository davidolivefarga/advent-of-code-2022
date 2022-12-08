const input = require("./input");

function solve(terminalOutputLines) {
    const directorySizes = {};
    const visitedFilePaths = new Set();

    let currentDirectoryPath = [];

    for (const line of terminalOutputLines) {
        if (line.startsWith("$ cd")) {
            const [, , directory] = line.split(" ");

            if (directory === "/") {
                currentDirectoryPath = ["/"];
            } else if (directory === "..") {
                currentDirectoryPath.pop();
            } else {
                currentDirectoryPath.push(directory);
            }
        } else if (line !== "$ ls" && !line.startsWith("dir")) {
            const [fileSize, file] = line.split(" ");
            const filePath = [...currentDirectoryPath, file].join("/");

            if (visitedFilePaths.has(filePath)) {
                continue;
            }

            visitedFilePaths.add(filePath);

            for (let i = 1; i <= currentDirectoryPath.length; i++) {
                const directoryPath = currentDirectoryPath
                    .slice(0, i)
                    .join("/");

                if (!directorySizes[directoryPath]) {
                    directorySizes[directoryPath] = 0;
                }

                directorySizes[directoryPath] += Number(fileSize);
            }
        }
    }

    return Object.values(directorySizes).reduce(
        (totalSize, directorySize) =>
            directorySize <= 100000 ? totalSize + directorySize : totalSize,
        0
    );
}

console.log(solve(input));
