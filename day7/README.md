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

Since we're only interested in the directory sizes, we can ignore most of the terminal information.

It is enough to:

-   Keep track of the current directory path
-   Keep track of the visited files (they could appear more than once)

With this information, every time we encounter a new file we know its path because we know the current directory path. If it hasn't been visited yet, we can increase the size of the current directory and all of its parent directories.

Once we have the size of each directory, we just need to loop through them in order to calculate the desired answer.

_Note:_ the provided input never visits the same file twice, so we could get rid of the `visitedFilePaths` logic and the solution would still work. However, for the sake of having a strong solution, I decided to keep it that way.

```js
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
```

## 🧩 Second puzzle

### Objective

The total available space is 70000000, and we need 30000000 of free space.

It is guaranteed that the current collection of directories doesn't have enough free space, so a directory must be deleted to attain that space. From all the directories that could attain that space when deleted, find the one with the smallest size and return its size.

### Solution

Very similar to the previous solution, nothing interesting to add.

```js
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

    const availableSpace = 70000000 - directorySizes["/"];
    const missingSpace = 30000000 - availableSpace;

    let minSizeDirectory = Number.POSITIVE_INFINITY;

    Object.values(directorySizes).forEach((directorySize) => {
        if (directorySize >= missingSpace && directorySize < minSizeDirectory) {
            minSizeDirectory = directorySize;
        }
    });

    return minSizeDirectory;
}

console.log(solve(input));
```
