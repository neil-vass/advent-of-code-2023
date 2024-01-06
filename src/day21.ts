import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {FifoQueue, Graph} from "./graphSearch.js";

class BetterSet extends Set<number> {
    union(other: BetterSet)  {
        other.forEach(n => this.add(n));
    }
}

type Pos = { x: number, y: number };
type HashedPos = string;

const hash = (pos: Pos) : HashedPos => JSON.stringify(pos);
const unhash = (s: HashedPos) : Pos => JSON.parse(s);

export class Garden {
    private infiniteBounds = false;

    private constructor(readonly grid: string[][], readonly start: Pos) {}

    isInsideBounds(pos: Pos) {
        return (pos.x >= 0 && pos.x < this.grid.length &&
                pos.y >= 0 && pos.y < this.grid[0].length);
    }

    isPlot(pos: Pos) {
        if (this.infiniteBounds) {
            const modPos = {
                x: pos.x % this.grid.length,
                y: pos.y % this.grid[0].length
            };

            return this.grid.at(modPos.x)!.at(modPos.y) !== "#";
        }

        return this.isInsideBounds(pos) && this.grid[pos.x][pos.y] !== "#";
    }

    neighbours(pos: Pos) {
        const directions = [{x:pos.x-1, y:pos.y}, {x:pos.x+1, y:pos.y}, {x:pos.x, y:pos.y-1}, {x:pos.x, y:pos.y+1}];
        return directions.filter(d => this.isPlot(d));
    }


    // Adapted from graphSearch.ts
    numPlotsReachable(totalSteps: number, start=this.start) {
        let reachablePlotCount = 0;
        const frontier = new FifoQueue<{ pos: Pos, steps: number }>();
        const visited = new Set<HashedPos>();

        frontier.push({ pos: start, steps: 0 });
        visited.add(hash(start));

        while (!frontier.isEmpty()) {
            const current = frontier.pull()!;
            if (current.steps > totalSteps) continue;
            if (current.steps % 2 === totalSteps % 2) reachablePlotCount++;

            for (const n of this.neighbours(current.pos)) {
                const hashedNeighbour = hash(n);
                if (!visited.has(hashedNeighbour)) {
                    frontier.push({ pos: n, steps: current.steps +1 });
                    visited.add(hashedNeighbour);
                }
            }
        }

        return reachablePlotCount;
    }

    static async buildFromDescription(lines: Sequence<string>) {
        const grid = new Array<Array<string>>();
        let start = {x:0, y:0};
        let x = 0;
        for await (const line of lines) {
            const row = line.split("");
            grid.push(row);
            const startIdx = row.indexOf("S");
            if (startIdx !== -1) start = {x, y: startIdx};
            x++;
        }

        return new Garden(grid, start);
    }

    static async withInfiniteBounds(lines: Sequence<string>) {
        const garden = await Garden.buildFromDescription(lines);
        garden.infiniteBounds = true;
        return garden;
    }
}


export async function solvePart1(lines: Sequence<string>) {
    const garden = await Garden.buildFromDescription(lines);
    return garden.numPlotsReachable(64);
}

export async function solvePart2(lines: Sequence<string>, steps=26501365) {
    const garden = await Garden.withInfiniteBounds(lines);
    return garden.numPlotsReachable(steps);
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day21.txt");
    console.log(await solvePart1(lines));
}