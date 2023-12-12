import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {FifoQueue} from "./graphSearch.js";


type ConditionRecord = string;
type Groups = Array<number>;

export function parseLine(line: string): [ConditionRecord, Groups] {
    const [recordStr, groupsStr] = line.split(" ");
    const m = groupsStr.match(/(\d+)/g);
    if (m === null) throw new Error(`Unexpected line ${line}`);
    return [recordStr, m.map(Number)];
}

export function knownDamagedGroups(condition: ConditionRecord) {
    const m = condition.match(/#+/g);
    if (m === null) return [];
    return m.map(g => g.length);
}

export function countUnknowns(condition: ConditionRecord) {
    let count = 0;
    for (let i=0; i < condition.length; i++) {
        if (condition[i] === "?") count++;
    }
    return count;
}

// Rules out various cases for now, can add more in future.
export function couldMatch(condition: ConditionRecord, damaged: Groups) {
    const sum = (arr: number[]) => arr.reduce((a,b) => a+b,  0);

    const damagedSoFar = knownDamagedGroups(condition);
    const numDamagedSoFar = sum(damagedSoFar);
    const numDamagedInTotal = sum(damaged);
    if (numDamagedSoFar > numDamagedInTotal) return false;

    const numUnknowns = countUnknowns(condition);
    if ((numDamagedSoFar + numUnknowns) < numDamagedInTotal) return false;

    const biggestDamagedGroup = Math.max(...damaged);
    if (damagedSoFar.some(d => d > biggestDamagedGroup)) return false;

    return true;
}

export function matches(condition: ConditionRecord, damaged: Groups) {
    if (condition.includes("?")) return false;

    const damagedInCondition = knownDamagedGroups(condition);
    if (damagedInCondition.length !== damaged.length) return false;

    for (let i=0; i < damagedInCondition.length; i++) {
        if (damagedInCondition[i] !== damaged[i]) return false;
    }

    return true;
}

export function neighbours(condition: ConditionRecord, damaged: Groups) {
    const options = Array<string>();
    const q = condition.indexOf("?");
    if (q > -1) {
        const splitCondition = condition.split("");
        splitCondition[q] = ".";
        options.push(splitCondition.join(""));
        splitCondition[q] = "#";
        options.push(splitCondition.join(""));
    }
    return options.filter(c => couldMatch(c, damaged));;
}

// Breadth first search, returning all goal nodes found.
// Copied the function breadthFirstSearch from ./graphSearch.js
// to customise it for this problem.
function findAllMatches(startingCondition: ConditionRecord, correctDamagedGroups: Groups) {
    const frontier = new FifoQueue<string>();
    const reached = new Set<string>();
    const possibleArrangements = Array<string>();

    frontier.push(startingCondition);
    reached.add(startingCondition);

    while (!frontier.isEmpty()) {
        const current = frontier.pull()!;
        for (const n of neighbours(current, correctDamagedGroups)) {
            if (!reached.has(n)) {
                if (matches(n, correctDamagedGroups)) {
                    possibleArrangements.push(n);
                } else {
                    frontier.push(n);
                }
                reached.add(n);
            }
        }
    }
    return possibleArrangements;
}


export function possibleArrangements(s: string) {
    const [startingCondition, correctDamagedGroups] = parseLine(s);
    return findAllMatches(startingCondition, correctDamagedGroups).length;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day12.txt";
    const lines = linesFromFile(filepath);
    const part1Answer = await Sequence.sum(lines.map(possibleArrangements));
    console.log(part1Answer);
}