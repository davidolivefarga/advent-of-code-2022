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
