# Day 10: Cathode-Ray Tube

You can find the puzzles [here](https://adventofcode.com/2022/day/10).

## ✍🏼 Input

A list of instructions, with two possible types:

-   `noop`
-   `addx 123`

Example:

```js
[
    ["noop"],
    ["addx", 3],
    ["addx", -5],
    ["noop"],
    ["addx", -15],
    ["addx", 11],
    ["addx", 5],
];
```

## 🧩 First puzzle

### Objective

There's a CRT machine whose CPU has a single register with initial value `1`.

The CPU contains a clock circuit, that ticks at a constant rate; each tick is called a cycle.

The instructions operate as follows:

-   `noop`: takes one cycle to complete; it has no other effect
-   `addx 123`: takes two cycles two complete; at the end of the second cycle it increases it increases the CPU register by `123`

The strength signal of a cycle is calculated as the cycle number multiplied by the value of the CPU register.

Find the sum of the signal strengths during the `20th` cycle and every `40` cycles after that.

### Solution

Straight-forward solution, nothing interesting to add.

```js
const input = require("./input");

function solve(instructions) {
    let totalSignalStrength = 0;

    let cycle = 0;
    let cpuRegister = 1;

    const increaseCycle = () => {
        cycle++;

        if ((cycle - 20) % 40 === 0) {
            totalSignalStrength += cycle * cpuRegister;
        }
    };

    for (const [instruction, value] of instructions) {
        increaseCycle();

        if (instruction !== "noop") {
            increaseCycle();

            cpuRegister += value;
        }
    }

    return totalSignalStrength;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

The CTR machine is rendering an image with `40 x 6` pixels.

To understand how the image is rendered:

-   The CPU register is controlling a sprite, which is `3` pixels wide. The CPU register represents the horizontal position of the middle pixel of that sprite.
-   During each cycle, the machine draws a pixel of the image:
    -   If the position of that pixel in the corresponding image row coincides with one of the positions covered by the sprite, the machine draws a lit pixel (`#`)
    -   Otheriwse, the machine draws a dark pixel (`.`).

Render the image and return the eight capital letters that appear in it.

### Solution

The only interesting thing worth discussing is the calculation of the position of a pixel in an image row for a given cycle.

The calculation is `(cycle - 1) % 40`:

-   Pixels are 0-indexed, while cycles are 1-indexed; that's why we need to subtract 1
-   Rows are 40 pixels wide; that's why we need to apply modulo 40 to be relative to the row

```js
const input = require("./input");

function solve(instructions) {
    let image = "";

    let cycle = 0;
    let cpuRegister = 1;

    const increaseCycle = () => {
        cycle++;

        const pixelRowPosition = (cycle - 1) % 40;

        if (
            pixelRowPosition >= cpuRegister - 1 &&
            pixelRowPosition <= cpuRegister + 1
        ) {
            image += "#";
        } else {
            image += ".";
        }

        if (cycle % 40 === 0) {
            image += "\n";
        }
    };

    for (const [instruction, value] of instructions) {
        increaseCycle();

        if (instruction !== "noop") {
            increaseCycle();

            cpuRegister += value;
        }
    }

    return image;
}

console.log(solve(input));
```
