import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";


export type Part = { [index: string]: number };

export type Rule = (part: Part) => string;

export const ACCEPT = "A";
export const REJECT = "R";
export const PASS = "PASS";

export class Workflow {
    private readonly rules = new Array<Rule>();

    constructor(public readonly name: string) {}

    add(rule: Rule) {
        this.rules.push(rule);
    }

    process(part: Part) {
        for (const rule of this.rules) {
            const result = rule(part);
            if (result !== PASS) return result;
        }
        throw new Error("Ran out of rules");
    }
}

export class System {

    private readonly steps = new Map<string, Workflow>();
    private acceptedTotal = 0;

    addWorkflow(workflowStr: string) {
        const workflow = parseWorkflow(workflowStr);
        this.steps.set(workflow.name, workflow);
    }

    process(partStr: string) {
        const part = parsePart(partStr);
        let entryPoint="in"
        while (true) {
            const result = this.steps.get(entryPoint)!.process(part);

            switch (result) {
                case REJECT:
                    return;
                case ACCEPT:
                    this.acceptedTotal += part.x + part.m + part.a + part.s;
                    return;
                default:
                    entryPoint = result;
            }
        }
    }

    acceptedTotalRatings() {
        return this.acceptedTotal;
    }
}

export function parseRule(ruleStr: string): Rule {
    const endRuleMatch = ruleStr.match(/^\w+$/);
    if (endRuleMatch !== null) {
        return (part: Part) => ruleStr;
    }

    const matchObject = ruleStr.match(/^([xmas])([<>])(\d+):(\w+)$/);
    if (matchObject === null) throw new Error(`Unexpected format: ${ruleStr}`);
    const [, category, op, valueStr, destination] = matchObject;
    const val = +valueStr;
    const matchesRule = (a: number) => (op === "<") ? a < val : a > val;

    return (part: Part) => matchesRule(part[category]) ? destination : PASS;
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


export async function solvePart1(lines: Sequence<string>) {
    const system = new System();
    let beforeGap = true;
    for await (const line of lines) {
        if (line === "") {
            beforeGap = false;
            continue;
        }

        if (beforeGap) {
            system.addWorkflow(line);
        } else {
            system.process(line);
        }
    }
    return system.acceptedTotalRatings();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day19.txt");
    console.log(await solvePart1(lines));
}