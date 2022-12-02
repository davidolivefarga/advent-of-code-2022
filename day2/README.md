# Day 2: Rock Paper Scissors

You can find the puzzles [here](https://adventofcode.com/2022/day/2).

## ✍🏼 Input

A list of pairs of characters:

Example:

```js
const input = [
	["A", "Y"],
	["B", "X"],
	["C", "Z"],
];
```

## 🧩 First puzzle

### Objective

The characters represent a list of choices in a Paper/Rock/Scissors game:

- `A`: your opponent plays Rock
- `B`: your opponent plays Paper
- `C`: your opponent plays Scissors
- `X`: you play Rock
- `Y`: you play plays Paper
- `Z`: you play plays Scissors

The score of each game is obtained as follows:

- If you play Rock/Paper/Scissors, you obtain 1/2/3 points
- If you lose/draw/win, you obtain 0/3/6 points

Find your total score after all games have finished.

### Solution

Since there's only 6 combinations, it's convenient to precalculate them and then just loop over the games.

```js
const input = require("./input");

const SCORES = {
	A: {
		X: 1 + 3, // Rock - Rock
		Y: 2 + 6, // Rock - Paper
		Z: 3 + 0, // Rock - Scissors
	},
	B: {
		X: 1 + 0, // Paper - Rock
		Y: 2 + 3, // Paper - Paper
		Z: 3 + 6, // Paper - Scissors
	},
	C: {
		X: 1 + 6, // Scissors - Rock
		Y: 2 + 0, // Scissors - Paper
		Z: 3 + 3, // Scissors - Scissors
	},
};

function solve(games) {
	return games.reduce(
		(acc, [opponentChoice, yourChoice]) =>
			acc + SCORES[opponentChoice][yourChoice],
		0
	);
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same as before, but this time the characters `X`, `Y` and `Z` represent strategies instead of choices:

- `X`: you need to lose
- `Y`: you need to draw
- `Z`: you need to win

The calculation of the score of each game also remains the same.

Find your total score after all games have finished.

### Solution

Same as before, precalculate the combinations and then just loop over the games.

```js
const input = require("./input");

const SCORES = {
	A: {
		X: 3 + 0, // Rock - Scissors
		Y: 1 + 3, // Rock - Rock
		Z: 2 + 6, // Rock - Paper
	},
	B: {
		X: 1 + 0, // Paper - Rock
		Y: 2 + 3, // Paper - Paper
		Z: 3 + 6, // Paper - Scissors
	},
	C: {
		X: 2 + 0, // Scissors - Paper
		Y: 3 + 3, // Scissors - Scissors
		Z: 1 + 6, // Scissors - Rock
	},
};

function solve(games) {
	return games.reduce(
		(acc, [opponentChoice, strategy]) => acc + SCORES[opponentChoice][strategy],
		0
	);
}

console.log(solve(input));
```
