import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

const ROCK = "O";
const CLEAR = ".";

export type Dir = { row: -1|0|1, col: -1|0|1 };
export const North: Dir = { row: -1, col: 0 };
export const West: Dir = { row: 0, col: -1 };
export const South: Dir = { row: +1, col: 0 };
export const East: Dir = { row: 0, col: +1 };

export class Panel {
    private grid = new Array<Array<string>>();

    private constructor() {}

    private rockCount(row: number) {
        return this.grid[row].filter(c => c === ROCK).length;
    }

    totalLoad() {
        let total = 0;
        for (let i=0; i < this.grid.length; i++) {
            total += this.rockCount(i) * (this.grid.length - i);
        }
        return total;
    }

    isInsideBounds(row: number, col: number) {
        return (row >= 0 && row < this.grid.length &&
                col >= 0 && col < this.grid[0].length);
    }


    private roll(row: number, col: number, dir: Dir) {
        let [newRow, newCol] = [row, col];
        let [nextRow, nextCol] = [row + dir.row, col + dir.col];
        while (this.isInsideBounds(nextRow, nextCol) && this.grid[nextRow][nextCol] === CLEAR) {
            [newRow, newCol] = [nextRow, nextCol];
            [nextRow, nextCol] = [nextRow + dir.row, nextCol + dir.col];
        }

        this.grid[row][col] = CLEAR;
        this.grid[newRow][newCol] = ROCK;
    }

    private *count(min: number, max: number, increment: -1|0|1) {
        if (min === max) return min;
        if (increment === 0) increment = -1;

        let [current, end] = increment === -1 ? [min, max] : [max, min];
        while (current !== end) {
            yield current;
            current -= increment;
        }
        yield end;
    }

    tilt(dir: Dir) {
        for (const row of this.count(0, this.grid.length-1, dir.row)) {
            for (const col of this.count(0, this.grid[0].length-1, dir.col)) {
                if (this.grid[row][col] === ROCK) this.roll(row, col, dir);
            }
        }
    }

    cycle(repeat=1) {
        for (let i=0; i < repeat; i++) {
            this.tilt(North);
            this.tilt(West);
            this.tilt(South);
            this.tilt(East);
        }
    }

    print() {
        return this.grid.reduce((str, row) => str += row.join("") + "\n", "");
    }

    async configurationAfter(numCycles: number) {
        const results = new Map<string, number>();
        results.set(this.print(), 0);

        for (let i=1; i <= numCycles; i++) {
            this.cycle();
            const configuration = this.print();
            if (!results.has(configuration)) {
                results.set(configuration, i);
            } else {
                const startOfRepeats = results.get(configuration)!;
                const beforeRepeats = startOfRepeats -1;
                const periodOfRepeats = i - startOfRepeats;
                const target = (numCycles - beforeRepeats) % periodOfRepeats + beforeRepeats;
                const targetString = [...results.keys()][target];
                const targetDescription = new Sequence(targetString.trim().split("\n"));
                return Panel.buildFromDescription(targetDescription);
            }
        }
        return this;
    }

    static async buildFromDescription(lines: Sequence<string>) {
        const panel = new Panel();
        for await (const line of lines) {
            panel.grid.push(line.split(""));
        }
        return panel;
    }
}

async function solvePart1(lines: Sequence<string>) {
    const panel = await Panel.buildFromDescription(lines);
    panel.tilt(North);
    return panel.totalLoad();
}

export async function solvePart2(lines: Sequence<string>) {
    const panel = await Panel.buildFromDescription(lines);
    const targetPanel = await panel.configurationAfter(1_000_000_000);
    return targetPanel.totalLoad();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day14.txt";
    const lines = linesFromFile(filepath);
    console.log(await solvePart2(lines));
}