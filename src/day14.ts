import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

const isRock = (c: string) => c === "O";
const isClear = (c: string) => c === ".";

export type Dir = { row: -1|0|1, col: -1|0|1 }
export const North: Dir = { row: -1, col: 0 }

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

    tilt(dir: Dir) {
        for (let row=0; row < this.grid.length; row++) {
            for (let col=0; col < this.grid[0].length; col++) {
                if (isRock(this.grid[row][col])) this.roll(row, col, dir);
            }
        }
    }

    print() {
        for (const row of this.grid) {
            console.log(row.join(""));
        }
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