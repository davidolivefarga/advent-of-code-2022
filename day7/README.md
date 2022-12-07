# Day 7: No Space Left On Device

You can find the puzzles [here](https://adventofcode.com/2022/day/7).

## ✍🏼 Input

A terminal output after navigating through some directories and printing their contents.

The outermost directory is `/`, and there are two possible commands:

-   `$ cd`: changes the current directory:
    -   `$ cd /`: go to `/`
    -   `$ cd ..`: move out one level (to the parent directory)
    -   `$ cd x`: move in one level (to the child directory called `x`)
-   `$ ls`: lists the contents of the current directory:
    -   `dir xyz`: the current directory contains a directory called `xyz`
    -   `123 abc`: the current directory contains a file called `abc` with size `123`

Example:

```js
const input = [
    "$ cd /",
    "$ ls",
    "dir a",
    "14848514 b.txt",
    "8504156 c.dat",
    "dir d",
    "$ cd a",
    "$ ls",
    "dir e",
    "29116 f",
    "2557 g",
    "62596 h.lst",
    "$ cd e",
    "$ ls",
    "584 i",
    "$ cd ..",
    "$ cd ..",
    "$ cd d",
    "$ ls",
    "4060174 j",
    "8033020 d.log",
    "5626152 d.ext",
    "7214296 k",
];
```

## 🧩 First puzzle

### Objective

Find the sum of the sizes of all directories with a total size of at most 100000.

### Solution

The problem doesn't mention it, but directory names are not unique. For example, you could have a directory called `foo` and inside it, another directory also called `foo`. This costed me a couple wrong subimissions, until I was able to debug the problem 😅

As for the solution, it's quite straight-forward:

-   Parse the terminal output to calculate the contents of each directory
-   Calculate the size of each directory using recursion
-   Find the directories with the desired size and compute the sum of their sizes

```js
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
```

## 🧩 Second puzzle

### Objective

The total available space is 70000000, and we need 30000000 of free space.

It is guaranteed that the current collection of directories doesn't have enough free space, so a directory must be deleted to attain that space. From all the directories that could attain that space when deleted, find the one with the smallest size and return its size.

### Solution

Very similar to the previous solution, nothing interesting to add.

```js
const input = require("./input");

function solve(terminalOutput) {
    const directoryContents = getDirectoryContents(terminalOutput);

    const availableSpace = 70000000 - getDirectorySize("/", directoryContents);
    const missingSpace = 30000000 - availableSpace;

    const candidateDirectories = Object.keys(directoryContents)
        .map((directory) => +getDirectorySize(directory, directoryContents))
        .filter((directorySize) => directorySize >= missingSpace);

    candidateDirectories.sort((a, b) => a - b);

    return candidateDirectories[0];
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
```
