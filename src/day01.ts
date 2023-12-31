import {Sequence} from "./sequence.js";
import {linesFromFile} from "./helpers.js";


export function calibrationValue(s: string) {
    const digits = s.match(/\d/g);
    if(digits === null) throw new Error(`Line has no digits: ${s}`);

    // @ts-ignore From above check, we know digits has at least one element.
    return Number(digits.at(0) + digits.at(-1));
}

export function calibrationValueWithLetters(s: string) {
    const lettersToDigits: {[key:string]: string} = {
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "nine": "9"
    }

    const wordsAndDigits: string[] = [];
    const r = new RegExp(`(?=(${Object.keys(lettersToDigits).join('|')}|\\d)).`, 'g');
    let m = r.exec(s);
    while(m !== null) {
        wordsAndDigits.push(m[1]);
        m = r.exec(s);
    }

    let [first, last] = [wordsAndDigits.at(0), wordsAndDigits.at(-1)];
    if (first === undefined || last === undefined) throw new Error(`Line has no numbers: ${s}`);

    first = lettersToDigits[first] || first;
    last = lettersToDigits[last] || last;
    return Number(first + last);
}

export async function sumCalibrationValues(input: Sequence<string>, valueFn=calibrationValue) {
    const values = input.map(valueFn);
    return Sequence.sum(values);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const input = linesFromFile("./data/day01.txt");
    console.log(await sumCalibrationValues(input, calibrationValueWithLetters));
}
