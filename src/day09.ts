import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

export function parseReadings(s: string) {
    return s.split(" ").map(n => +n);
}

export function predictNextValue(values: Array<number>) {
    let prediction = 0;
    while (!values.every(v => v === 0)) {
        prediction += values.at(-1)!;
        const diffs = new Array<number>();
        for (let i=1; i < values.length; i++) {
            diffs.push(values[i] - values[i-1]);
        }
        values = diffs;
    }
    return prediction;
}

export function predictPreviousValue(values: Array<number>) {
    return predictNextValue(values.toReversed());
}

export async function solvePart1(lines: Sequence<string>) {
    const predictions = lines.map(ln => parseReadings(ln)).map(r => predictNextValue(r))
    return Sequence.sum(predictions);
}


export async function solvePart2(lines: Sequence<string>) {
    const predictions = lines.map(ln => parseReadings(ln)).map(r => predictPreviousValue(r))
    return Sequence.sum(predictions);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day09.txt");
    console.log(await solvePart2(lines));
}