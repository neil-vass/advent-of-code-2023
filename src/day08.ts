import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";


class Navigator {
    constructor(private readonly instructionStr: string,
                private readonly network: Map<string, Array<string>>) {}

    stepsBetween(start: string, goal: string) {
        let steps = 0;
        let current = start;
        for (const dir of generateInstructions(this.instructionStr)) {
            if (current === goal) break;

            current = this.network.get(current)![dir];
            steps++;
        }
        return steps;
    }


    parallelStepsBetween(startSuffix: string, goalSuffix: string) {
        let steps = 0;
        let current = [...this.network.keys()].filter(k => k.endsWith(startSuffix));
        const endings = Array.from(current, () => new Array<number>());

        for (const dir of generateInstructions(this.instructionStr)) {
            current = current.map(c => this.network.get(c)![dir]);
            steps++;
            current.forEach((c,i) => { if (c.endsWith(goalSuffix)) endings[i].push(steps) });
            if (endings.every(e => e.length > 0)) break;
        }

        const gcd = (a: number, b: number): number  => a ? gcd(b % a, a) : b;
        const lcm = (a: number, b: number) => a * b / gcd(a, b);
        const stepsUntilAllAtEnds = endings.map(e => e[0]).reduce(lcm);
        return stepsUntilAllAtEnds;
    }
}
export function *generateInstructions(s: string) {
    while (true) {
        for (const c of s) {
            yield c === "L" ? 0 : 1;
        }
    }
}

export async function parseInput(lines: Sequence<string>) {
    let instructionStr = "";
    const network = new Map<string, Array<string>>();
    for await (const ln of lines) {
        if (instructionStr === "") {
            instructionStr = ln;
        } else if (ln === "") {
            continue;
        } else {
            const m = ln.match(/^(\w+) = \((\w+), (\w+)\)$/);
            if (m === null) throw new Error(`Unexpected line: ${ln}`);
            const [, from, left, right] = m;
            network.set(from, [left, right]);
        }
    }

    return new Navigator(instructionStr, network);
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day08.txt";
    const navigator = await parseInput(linesFromFile(filepath));
    console.log(navigator.parallelStepsBetween("A", "Z"));
}