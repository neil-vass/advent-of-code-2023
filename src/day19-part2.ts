import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";


export type Rule = (partsRage: PartsRange) => { matched: {destination: string, range: PartsRange}, unmatched: PartsRange | null }

export const ACCEPT = "A";
export const REJECT = "R";
export const PASS = "PASS";

class CategoryRange {
    readonly count;
    constructor(readonly min: number, readonly max: number) {
        this.count = max - min +1;
    }

    static readonly full = new CategoryRange(1, 4000);
}

export class PartsRange {
    private constructor(private readonly categories: {[index: string]: CategoryRange}) {}

    static readonly full = new PartsRange({ "x": CategoryRange.full,
                                            "m": CategoryRange.full,
                                            "a": CategoryRange.full,
                                            "s": CategoryRange.full});

    combinations() {
        return Object.values(this.categories).reduce((acc,val) => acc * val.count, 1);
    }

    splitGreaterThan(category: string, value: number) {
        const current = this.categories[category];
        const filterForMatched = new CategoryRange(value+1, current.max);
        const filterForUnmatched = new CategoryRange(current.min, value);
        return this.split(category, filterForMatched, filterForUnmatched);
    }

    splitLessThan(category: string, value: number) {
        const current = this.categories[category];
        const filterForMatched = new CategoryRange(current.min, value-1);
        const filterForUnmatched = new CategoryRange(value, current.max);
        return this.split(category, filterForMatched, filterForUnmatched);
    }

    private split(category: string, filterForMatched: CategoryRange, filterForUnmatched: CategoryRange) {
        const matched = {...this.categories};
        matched[category] = filterForMatched;
        const unmatched = {...this.categories};
        unmatched[category] = filterForUnmatched;
        return [new PartsRange(matched), new PartsRange(unmatched)];
    }
}


export class Workflow {
    private readonly rules = new Array<Rule>();

    constructor(public readonly name: string) {}

    add(rule: Rule) {
        this.rules.push(rule);
    }

    process(partsRange: PartsRange) {
        const destinationsAndRanges = new Map<string, PartsRange>();
        let remainingRange = partsRange;
        for (const rule of this.rules) {
            const result = rule(remainingRange);
            destinationsAndRanges.set(result.matched.destination, result.matched.range);
            if (result.unmatched === null) break;
            remainingRange = result.unmatched;
        }
        return destinationsAndRanges;
    }
}

export class System {
    private readonly steps = new Map<string, Workflow>();

    addWorkflow(workflowStr: string) {
        const workflow = parseWorkflow(workflowStr);
        this.steps.set(workflow.name, workflow);
    }

    countAcceptableCombinations() {
        const partsRange = PartsRange.full;
        return this.countCombos(partsRange);

    }

    private countCombos(partsRange: PartsRange, entryPoint="in") {
        let count = 0;
        const workflow = this.steps.get(entryPoint)!;
        const destinationsAndRanges = workflow.process(partsRange);
        for (const [destination, range] of destinationsAndRanges) {
            switch(destination) {
                case REJECT:
                    continue;
                case ACCEPT:
                    count += range.combinations();
                    break;
                default:
                    count += this.countCombos(range, destination);
            }
        }
        return count;
    }
}

export function parseRule(ruleStr: string): Rule {
    const endRuleMatch = ruleStr.match(/^\w+$/);
    if (endRuleMatch !== null) {
        return (partsRange: PartsRange) => ({ matched: {destination: ruleStr, range: partsRange}, unmatched: null });
    }

    const matchObject = ruleStr.match(/^([xmas])([<>])(\d+):(\w+)$/);
    if (matchObject === null) throw new Error(`Unexpected format: ${ruleStr}`);
    const [, category, op, valueStr, destination] = matchObject;
    const val = +valueStr;

    function rule(partsRange: PartsRange) {
        if (op === "<") {
            const [matchedRange, unmatchedRange] = partsRange.splitLessThan(category, val);
            return { matched: {destination, range: matchedRange }, unmatched: unmatchedRange };
        } else {
            const [matchedRange, unmatchedRange] = partsRange.splitGreaterThan(category, val);
            return { matched: {destination, range: matchedRange }, unmatched: unmatchedRange };
        }
    }
    return rule;
}

export function parseWorkflow(workflowStr: string) {
    const matchObject = workflowStr.match(/^(\w+){(.+)}$/);
    if (matchObject === null) throw new Error(`Unexpected format: ${workflowStr}`);
    const [, name, rulesStr] = matchObject;

    const workflow = new Workflow(name);
    rulesStr.split(",").map(parseRule).forEach(rule => workflow.add(rule));
    return workflow;
}

export function parsePart(partStr: string) {
    const matchObject = partStr.match(/^{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}$/);
    if (matchObject === null) throw new Error(`Unexpected format: ${partStr}`);
    const [,x,m,a,s] = matchObject.map(Number);
    return {x,m,a,s};
}


export async function solvePart2(lines: Sequence<string>) {
    const system = new System();
    for await (const line of lines) {
        if (line === "") break;
        system.addWorkflow(line);
    }
    return system.countAcceptableCombinations();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day19.txt");
}