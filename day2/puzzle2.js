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
		(acc, [opponentChoice, strategy]) =>
			acc + SCORES[opponentChoice][strategy],
		0
	);
}

console.log(solve(input));
