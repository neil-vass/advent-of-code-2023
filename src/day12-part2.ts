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

export function unfold(s: string, scale=5) {
    let [condition, groups] = s.split(" ");
    condition = (condition+"?").repeat(scale).slice(0, -1);
    groups = (groups+",").repeat(scale).slice(0, -1);
    return `${condition} ${groups}`;
}

let cache = new Map<string, number>();
let calls = 0;
let cacheHits = 0;

export function possibleArrangements(condition: ConditionRecord, damaged: Groups): number {
    calls++;
    const hashKey = condition + damaged.toString();
    const cachedResult = cache.get(hashKey)
    if (cachedResult !== undefined) {
        cacheHits++;
        return cachedResult;
    }

    function wrapped() {
        // No first group? We're done.
        if (damaged.length === 0) {
            if (condition.indexOf("#") === -1) return 1;
            else return 0;
        }

        // Get first group, solve for that, recurse with the rest of the info.
        const [sizeOfFirstGroup, ...restOfGroups] = damaged;
        const firstQ = condition.indexOf("?");
        const thereIsAQ = firstQ !== -1;
        const firstHash = condition.indexOf("#");
        const thereIsAHash = firstHash !== -1;

        if (thereIsAQ && (!thereIsAHash || firstQ < firstHash)) {
            const biggestGroupThisCouldMake = condition.slice(firstQ).match(/^[?#]+/)![0].length;
            if (biggestGroupThisCouldMake < sizeOfFirstGroup) {
                // Must just be a dot. String up to and including it can be dropped.
                return possibleArrangements(condition.slice(firstQ + 1), damaged);
            } else {
                // Worth exploring.
                const dot = condition.slice(firstQ + 1);
                const hash = "#" + dot;
                return possibleArrangements(dot, damaged) + possibleArrangements(hash, damaged);
            }
        }

        if (thereIsAHash) {
            // We _must_ be able to match the first group in the list from this position,
            // or else this condition can't match this damaged list.
            const groupEndIdx = firstHash + sizeOfFirstGroup;
            if (groupEndIdx > condition.length) return 0;

            const groupChunk = condition.slice(firstHash, groupEndIdx);
            const isEndOfGroup = (groupEndIdx === condition.length) || (condition[groupEndIdx] !== "#");
            const canMakeGroup = isEndOfGroup && groupChunk.match(/^[?#]+$/);

            if (canMakeGroup) {
                return possibleArrangements(condition.slice(groupEndIdx + 1), restOfGroups);
            }
        }

        // If we reach here, "damaged" can't describe this condition string.
        return 0;
    }

    const result = wrapped();
    cache.set(hashKey, result);
    return result;
}

export async function solvePart2(lines: Sequence<string>) {
    const inputs = lines.map(unfold).map(parseLine);
    const arrangements = inputs.map(([condition, damaged]) => possibleArrangements(condition, damaged));
    return Sequence.sum(arrangements);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day12.txt";
    const lines = linesFromFile(filepath);
    console.log(await solvePart2(lines));
}