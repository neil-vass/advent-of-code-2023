import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

export type Pos = { x: number, y: number };
export type DigStep = { dir: "U"|"R"|"D"|"L", distance: number };

export function parseDigStep(s: string) {
    const m = s.match(/^([URDL]) (\d+) \((#[0-9a-f]{6})\)$/);
    if (m === null) throw new Error(`Unrecognized line format: ${s}`);
    const [, dirStr, distStr] = m;
    return { dir: dirStr, distance: +distStr } as DigStep;
}

export function colourToDigStep(hexColourCode: string) {
    const dirMap = new Map([["0", "R"], ["1", "D"], ["2", "L"], ["3", "U"]]);
    const dir = dirMap.get(hexColourCode.at(-1)!)!;
    const distance = parseInt(hexColourCode.slice(1,-1), 16);
    return {dir, distance} as DigStep;
}

export function parseColour(s: string) {
    const m = s.match(/^[URDL] \d+ \((#[0-9a-f]{6})\)$/);
    if (m === null) throw new Error(`Unrecognized line format: ${s}`);
    return m[1];
}

export function positionAfterDigStep(start: Pos, digStep: DigStep) {
    const dist = digStep.distance
    switch(digStep.dir) {
        case "U": return { x: start.x - dist, y: start.y };
        case "R": return { x: start.x, y: start.y + dist };
        case "D": return { x: start.x + dist, y: start.y };
        case "L": return { x: start.x, y: start.y - dist };
    }
}

export class Digger {
    private constructor(readonly digPlan: Array<DigStep>) {}

    holeVolume() {
        let sum = 0;
        let boundary = 0;

        // Shoelace theorem to find area (treating points as vertices, not squares).
        // https://artofproblemsolving.com/wiki/index.php/Shoelace_Theorem
        let current: Pos = {x:0, y:0};
        for (const step of this.digPlan) {
            const next = positionAfterDigStep(current, step);
            boundary += step.distance;
            sum += (next.x + current.x) * (next.y - current.y);
            current = next;
        }
        const area = Math.abs(sum) / 2;

        // Pick's theorem to find the number of interior points.
        // https://artofproblemsolving.com/wiki/index.php/Pick%27s_Theorem
        const interior = area - (boundary / 2) + 1;

        return boundary + interior;
    }

    static async buildFromDescription(lines: Sequence<string>) {
        const digPlan = await lines.map(parseDigStep).toArray();
        return new Digger(digPlan);
    }

    static async buildWithColourCorrection(lines: Sequence<string>) {
        const digPlan = await lines.map(parseColour).map(colourToDigStep).toArray();
        return new Digger(digPlan);
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const digger = await Digger.buildFromDescription(lines);
    return digger.holeVolume();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day18.txt");
    const digger = await Digger.buildWithColourCorrection(lines);
    console.log(digger.holeVolume());
}