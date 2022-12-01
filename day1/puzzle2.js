const input = require("./input");

function solve(groups) {
	let max1 = Number.NEGATIVE_INFINITY;
	let max2 = Number.NEGATIVE_INFINITY;
	let max3 = Number.NEGATIVE_INFINITY;

	for (let group of groups) {
		const sum = group.reduce((curr, acc) => curr + acc, 0);

		if (sum > max1) {
			[max1, max2, max3] = [sum, max1, max2];
		} else if (sum > max2) {
			[max1, max2, max3] = [max1, sum, max2];
		} else if (sum > max3) {
			[max1, max2, max3] = [max1, max2, sum];
		}
	}

	return max1 + max2 + max3;
}

console.log(solve(input));
