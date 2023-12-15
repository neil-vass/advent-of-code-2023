import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";


type ConditionRecord = string;
type Groups = Array<number>;


export function parseLine(line: string): [ConditionRecord, Groups] {
    const [recordStr, groupsStr] = line.split(" ");
    const m = groupsStr.match(/(\d+)/g);
    if (m === null) throw new Error(`Unexpected line ${line}`);
    return [recordStr, m.map(Number)];
}

export function unfold(s: string, scale: number) {
    let [condition, groups] = s.split(" ");
    condition = (condition+"?").repeat(scale).slice(0, -1);
    groups = (groups+",").repeat(scale).slice(0, -1);
    return `${condition} ${groups}`;
}

export function possibleArrangements(condition: ConditionRecord, damaged: Groups) {
    // get first group?
    if (damaged.length === 0) return 1;

    return 1;
}

export async function solvePart2(lines: Sequence<string>) {
    return 0;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day12-example.txt";
    const lines = linesFromFile(filepath);
    console.log(await solvePart2(lines));
}