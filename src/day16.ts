import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

export type Dir = { row: -1|0|1, col: -1|0|1 };
export const North: Dir = { row: -1, col: 0 };
export const West: Dir = { row: 0, col: -1 };
export const South: Dir = { row: +1, col: 0 };
export const East: Dir = { row: 0, col: +1 };

export class Contraption {

    private grid = new Array<>
    private constructor() {}
    static buildFromDescription(lines: Sequence<string>) {
        return new Contraption();
    }
}
export function fn(filepath: string) {
    return "Hello, World!";
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day16.txt";
    const lines = linesFromFile(filepath);
    for await (const line of lines) {
        console.log(line.length);
        console.log(line);
        break;
    }
}