import {Sequence} from "./sequence.js";
import {linesFromFile} from "./helpers.js";


export function calibrationValue(s: string) {
    const digits = s.match(/\d/g);
    if(digits === null) throw new Error(`Line has no digits: ${s}`);

    // @ts-ignore From above check, we know digits has at least one element.
    return Number(digits.at(0) + digits.at(-1));
}

export async function sumCalibrationValues(input: Sequence<string>) {
    const values = input.map(s => calibrationValue(s));
    return Sequence.sum(values);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const input = linesFromFile("./data/day01.txt");
    console.log(await sumCalibrationValues(input));
}
