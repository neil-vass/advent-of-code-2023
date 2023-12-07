import readline from "node:readline/promises";
import fs from "fs";
import {Sequence} from "./sequence.js";

export function singleLineFromFile(path: string) {
    return fs.readFileSync(path, "utf8").trimEnd();
}

export function linesFromFile(path: string) : Sequence<string> {
    async function* readFile() {
        for await (const line of readline.createInterface({input: fs.createReadStream(path)})) {
            yield line;
        }
    }
    return new Sequence(readFile());
}

export function permutations<T>(arr: T[]): Sequence<T[]> {

    // Heap's algorithm: a "decrease and conquer" method.
    // Operates on 'k' elements of the array at each step
    // (k starts at array's length and decreases by one each step).
    function* generatePermutations<T>(arr: T[], k: number = arr.length): Iterable<T[]> {
        if (k === 1) {
            yield [...arr];
        } else {
            for (let i = 0; i < k; i++) {
                yield* generatePermutations(arr, k - 1);
                if (k % 2 === 0) {
                    [arr[i], arr[k - 1]] = [arr[k - 1], arr[i]];
                } else {
                    [arr[0], arr[k - 1]] = [arr[k - 1], arr[0]];
                }
            }
        }
    }

    return new Sequence(generatePermutations(arr));
}
