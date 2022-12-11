const input = require("./input");

function solve(monkeys) {
    monkeys.forEach((monkey) => (monkey.inspectedItems = 0));

    for (let i = 0; i < 20; i++) {
        monkeys.forEach((monkey) => {
            monkey.items.forEach((item) => {
                monkey.inspectedItems++;

                const updatedItem = Math.floor(
                    getUpdatedItem(item, monkey) / 3
                );

                const nextMonkey = getNextMonkey(updatedItem, monkey);

                monkeys[nextMonkey].items.push(updatedItem);
            });

            monkey.items = [];
        });
    }

    monkeys.sort((m1, m2) => m2.inspectedItems - m1.inspectedItems);

    return monkeys[0].inspectedItems * monkeys[1].inspectedItems;
}

function getUpdatedItem(item, monkey) {
    let { operator, value } = monkey.operation;

    if (value === "item") {
        value = item;
    }

    if (operator === "+") {
        return item + value;
    } else {
        return item * value;
    }
}

function getNextMonkey(item, monkey) {
    const { divisor, caseTrue, caseFalse } = monkey.test;

    return item % divisor === 0 ? caseTrue : caseFalse;
}

console.log(solve(input));
