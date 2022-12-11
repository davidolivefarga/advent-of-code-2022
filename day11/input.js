const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput
    .trim()
    .split(/\n\n/)
    .map((rawMonkey) => {
        const rawMonkeyLines = rawMonkey.split(/\n/);

        const items = rawMonkeyLines[1].match(/\d+/g).map(Number);

        const operationOperator = rawMonkeyLines[2].match(/\*|\+/g)[0];
        let operationValue = rawMonkeyLines[2].match(/\d+/g);

        if (operationValue === null) {
            operationValue = "item";
        } else {
            operationValue = Number(operationValue);
        }

        const testDivisor = Number(rawMonkeyLines[3].match(/\d+/g));
        const testCaseTrue = Number(rawMonkeyLines[4].match(/\d+/g));
        const testCaseFalse = Number(rawMonkeyLines[5].match(/\d+/g));

        return {
            items,
            operation: {
                operator: operationOperator,
                value: operationValue,
            },
            test: {
                divisor: testDivisor,
                caseTrue: testCaseTrue,
                caseFalse: testCaseFalse,
            },
        };
    });

module.exports = input;
