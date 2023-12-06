import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";


export function waysToWin(duration: number, record: number) {
    let winCount = 0;
    for (let i=1; i < duration-1; i++) {
        const distance = (duration - i) * i;
        if (distance > record) winCount++;
    }
    return winCount;
}

export async function solvePart1(lines: Sequence<string>) {
    let times = new Array<number>();
    let records = new Array<number>();

    for await (const line of lines) {
        if (line.startsWith("Time:")) {
            times = line.match(/\d+/g)!.map(n => +n);
        } else if (line.startsWith("Distance:")) {
            records = line.match(/\d+/g)!.map(n => +n);
        }
    }

    let result = 1;
    for (let i=0; i<times.length; i++) {
        result *= waysToWin(times[i], records[i]);
    }
    return result;
}

export async function solvePart2(lines: Sequence<string>) {
    let time = 0;
    let record =0;

    for await (const line of lines) {
        if (line.startsWith("Time:")) {
            time = Number(line.match(/\d+/g)!.join(""));
        } else if (line.startsWith("Distance:")) {
            record = Number(line.match(/\d+/g)!.join(""));
        }
    }

    return waysToWin(time, record);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day06.txt";
    console.log(await solvePart2(linesFromFile(filepath)));
}