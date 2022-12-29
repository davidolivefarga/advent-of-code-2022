const input = require("./input");

function solve(monkeys) {
    let left = Number.MIN_SAFE_INTEGER;
    let right = Number.MAX_SAFE_INTEGER;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midDiff = getDiffRootElements(monkeys, mid);

        if (midDiff === 0) {
            return mid;
        }

        if (midDiff < 0) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
}

function getDiffRootElements(monkeys, humanValue) {
    const monkeyNumbers = {};

    monkeyNumbers["humn"] = humanValue;

    function getMonkeyNumber(monkeyName) {
        if (monkeyNumbers[monkeyName] !== undefined) {
            return monkeyNumbers[monkeyName];
        }

        let monkeyNumber;

        if (!Array.isArray(monkeys[monkeyName])) {
            monkeyNumber = monkeys[monkeyName];
        } else {
            const [m1, operation, m2] = monkeys[monkeyName];

            const m1Number = getMonkeyNumber(m1);
            const m2Number = getMonkeyNumber(m2);

            if (operation === "+") {
                monkeyNumber = m1Number + m2Number;
            } else if (operation === "-") {
                monkeyNumber = m1Number - m2Number;
            } else if (operation === "*") {
                monkeyNumber = m1Number * m2Number;
            } else {
                monkeyNumber = m1Number / m2Number;
            }
        }

        monkeyNumbers[monkeyName] = monkeyNumber;

        return monkeyNumber;
    }

    const [rootLeft, _, rootRight] = monkeys["root"];

    return getMonkeyNumber(rootRight) - getMonkeyNumber(rootLeft);
}

console.log(solve(input));
