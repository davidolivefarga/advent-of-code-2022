const input = require("./input");

function solve(monkeys) {
    const monkeyNumbers = {};

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

    return getMonkeyNumber("root");
}

console.log(solve(input));
