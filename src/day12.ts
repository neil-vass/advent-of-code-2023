import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {FifoQueue} from "./graphSearch.js";
import fs from "fs";


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

function fixedPartMatches(fixedPart: ConditionRecord, damaged: Groups) {
        const damagedInFixedPart = knownDamagedGroups(fixedPart);
        for (let i = 0; i < damagedInFixedPart.length; i++) {
            if (i === damagedInFixedPart.length - 1) {
                if (damagedInFixedPart[i] > damaged[i]) return false;
            } else {
                if (damagedInFixedPart[i] !== damaged[i]) return false;
            }
        }
        return true;
}

// Rules out various cases for now, can add more in future.
export function couldMatch(condition: ConditionRecord, damaged: Groups) {
    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

    const firstQuestionIdx = condition.indexOf("?");
    if (firstQuestionIdx === -1) return matches(condition, damaged);

    const fixedPart = condition.slice(0, firstQuestionIdx);

    if (!fixedPartMatches(fixedPart, damaged)) return false;

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

    for (let i = 0; i < damagedInCondition.length; i++) {
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
    return options.filter(c => couldMatch(c, damaged));
}

// Breadth first search, returning all goal nodes found.
// Copied the function breadthFirstSearch from ./graphSearch.js
// to customise it for this problem.
function findAllMatches(startingCondition: ConditionRecord, correctDamagedGroups: Groups) {
    const frontier = new FifoQueue<string>();
    const reached = new Set<string>();
    let possibleArrangements = 0;

    frontier.push(startingCondition);
    reached.add(startingCondition);

    while (!frontier.isEmpty()) {
        const current = frontier.pull()!;
        for (const n of neighbours(current, correctDamagedGroups)) {
            let notes = n;
            if (!reached.has(n)) {
                if (matches(n, correctDamagedGroups)) {
                    possibleArrangements++;
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
    const count = findAllMatches(startingCondition, correctDamagedGroups);
    return count;
}

export function unfold(s: string, scale: number) {
    let [condition, groups] = s.split(" ");
    condition = (condition+"?").repeat(scale).slice(0, -1);
    groups = (groups+",").repeat(scale).slice(0, -1);
    return `${condition} ${groups}`;
}

export async function solvePart2(lines: Sequence<string>) {
    let sum = 0;
    for await (const line of lines) {
        // const a = possibleArrangements(line);
        // const b = possibleArrangements(unfold(line, 2));
        // const ratio = b / a;
        // sum += a * Math.pow(ratio, 4);
        sum += possibleArrangements(unfold(line, 5));
    }
    return sum;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day12-example.txt";
    const lines = linesFromFile(filepath);
    console.log(await solvePart2(lines));
}