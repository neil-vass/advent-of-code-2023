import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";


function isMirror(a: string[], b: string[]) {
    a.reverse();
    for (let i=1; i < Math.min(a.length, b.length); i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
function reflectionRows(pattern: string[]) {
    const rows = new Array<number>();
    for (let i=1; i < pattern.length; i++) {
        if (pattern[i-1] === pattern[i]) {
            let [top, bottom] =  [pattern.slice(0, i), pattern.slice(i)];
            if(isMirror(top, bottom)) rows.push(i)
        }
    }
    return rows;
}


export function rotate(pattern: string[]) {
    const rotated = Array.from(pattern[0]);
    for(let i=1; i < pattern.length; i++) {
        for (let j=0; j < pattern[i].length; j++) {
            rotated[j] += pattern[i][j];
        }
    }
    return rotated;
}
function reflectionColumns(pattern: string[]) {
    return reflectionRows(rotate(pattern));
}

export function findValue(pattern: string[], discardValue=-1) {
    for (let rowVal of reflectionRows(pattern)) {
        rowVal *= 100;
        if (rowVal !== discardValue) return rowVal;
    }

    for (const colVal of reflectionColumns(pattern)) {
        if (colVal !== discardValue) return colVal;
    }
    return null;
}

let steps = 0;
export async function reflectionValue(lines: Sequence<string>, valueFn=findValue) {
    let total = 0;
    let pattern = new Array<string>();

    for await (const line of lines) {
        if (line === "") {
            steps++;
            total += valueFn(pattern)!;
            pattern = new Array<string>();
        } else {
            pattern.push(line);
        }
    }

    total += valueFn(pattern)!;
    return total;
}

function findValueAccountingForSmudge(pattern: string[]) {
    const withSmudge = findValue(pattern)!;
    for (let i=0; i < pattern.length; i++) {
        const curLine = pattern[i];
        for (let j=0; j < pattern[i].length; j++) {
            const replace = curLine[j] === "." ? "#" : ".";
            pattern[i] = curLine.slice(0,j) + replace + curLine.slice(j+1);

            const withoutSmudge = findValue(pattern, withSmudge);
            if (withoutSmudge !== null) return withoutSmudge;
            pattern[i] = curLine;
        }
    }
    console.log(pattern)
    console.log(steps)
    throw new Error("Can't account for smudge!");
}
export async function solvePart2(lines: Sequence<string>) {
    return reflectionValue(lines, findValueAccountingForSmudge);
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day13.txt");
    console.log(await solvePart2(lines));
}