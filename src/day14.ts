import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

const isRock = (c: string) => c === "O";
const isClear = (c: string) => c === ".";

export type Dir = { row: -1|0|1, col: -1|0|1 };
export const North: Dir = { row: -1, col: 0 };
export const West: Dir = { row: 0, col: -1 };
export const South: Dir = { row: +1, col: 0 };
export const East: Dir = { row: 0, col: +1 };

export class Panel {
    private grid = new Array<Array<string>>();

    private constructor() {}

    private rockCount(row: number) {
        return this.grid[row].filter(isRock).length;
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
        while (this.isInsideBounds(nextRow, nextCol) && isClear(this.grid[nextRow][nextCol])) {
            [newRow, newCol] = [nextRow, nextCol];
            [nextRow, nextCol] = [nextRow + dir.row, nextCol + dir.col];
        }

        this.grid[row][col] = ".";
        this.grid[newRow][newCol] = "O";
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
                if (isRock(this.grid[row][col])) this.roll(row, col, dir);
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

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day14.txt";
    const lines = linesFromFile(filepath);
    console.log(await solvePart1(lines));
}