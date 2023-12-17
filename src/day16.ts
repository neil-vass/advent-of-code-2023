import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {FifoQueue, Graph} from "./graphSearch.js";

type Pos = { x: number, y: number };
export enum Dir { Up, Right, Down, Left};

export function exitDirections(entryDirection: Dir, tile: string): Dir[] {
    switch (tile) {
        case ".":
            return [entryDirection];
        case "\\":
            return [(3-entryDirection) % 4];
        case "/":
            return [(5-entryDirection) % 4];
        case "|":
            if ([Dir.Up, Dir.Down].includes(entryDirection)) return [entryDirection];
            else return [Dir.Up, Dir.Down];
        case "-":
            if ([Dir.Left, Dir.Right].includes(entryDirection)) return [entryDirection];
            else return [Dir.Left, Dir.Right];
        default:
            throw new Error(`Unknown tile type: ${tile}`);
    }
}

export class HeadOfPath {
    constructor(readonly pos: Pos,
                readonly dir: Dir) {}

    neighbourPosition(dir: Dir) {
        switch(dir) {
            case Dir.Up: return { x: this.pos.x-1, y: this.pos.y };
            case Dir.Right: return { x: this.pos.x, y: this.pos.y+1 };
            case Dir.Down: return { x: this.pos.x+1, y: this.pos.y };
            case Dir.Left: return { x: this.pos.x, y: this.pos.y-1 };
        }
    }
}

export class Contraption {
    private constructor(readonly grid: string[][]) {}

    isInsideBounds(pos: Pos) {
        return (pos.x >= 0 && pos.x < this.grid.length &&
                pos.y >= 0 && pos.y < this.grid[0].length);
    }

    neighbours(headOfPath: HeadOfPath): HeadOfPath[] {
        const tile = this.grid[headOfPath.pos.x][headOfPath.pos.y];
        const directions = exitDirections(headOfPath.dir, tile);

        const results = new Array<HeadOfPath>();
        for (const dir of directions) {
            const pos = headOfPath.neighbourPosition(dir);
            if (this.isInsideBounds(pos)) results.push(new HeadOfPath(pos, dir));
        }
        return results;
    }

    // Adapted from breadthFirstSearch in ./src/graphSearch.ts.
    // Returns the collection of tiles energized by beam.
    propagateBeam(start: Pos, dir: Dir) {
        const hash = (o: any) => JSON.stringify(o);
        const startOfPath = new HeadOfPath(start, dir);

        const frontier = new FifoQueue<HeadOfPath>();
        frontier.push(startOfPath);

        const reachedTiles = new Set<string>();
        reachedTiles.add(hash(start));
        const reachedTilesWithDirection = new Set<string>();
        reachedTilesWithDirection.add(hash(startOfPath));

        while (!frontier.isEmpty()) {
            const current = frontier.pull()!;
            for (const n of this.neighbours(current)) {
                if (!reachedTilesWithDirection.has(hash(n))) {
                    frontier.push(n);
                    reachedTiles.add(hash(n.pos));
                    reachedTilesWithDirection.add(hash(n));
                }
            }
        }

        return reachedTiles;
    }

    countEnergizedTiles(beamStart: Pos, beamDirection: Dir) {
        const tiles = this.propagateBeam(beamStart, beamDirection);
        return tiles.size;
    }

    maximumEnergizedTiles() {
        let maxSoFar = 0;
        const [bottomX, rightmostY] = [this.grid.length-1, this.grid[0].length-1];

        for (let x=0; x <= bottomX; x++) {
            const fromLeft = this.countEnergizedTiles({x, y: 0}, Dir.Right);
            const fromRight = this.countEnergizedTiles({x, y: rightmostY}, Dir.Left);
            maxSoFar = Math.max(maxSoFar, fromLeft, fromRight);
        }

        for (let y=0; y <= rightmostY; y++) {
            const fromTop = this.countEnergizedTiles({x: 0, y}, Dir.Down);
            const fromBottom = this.countEnergizedTiles({x: bottomX, y}, Dir.Up);
            maxSoFar = Math.max(maxSoFar, fromTop, fromBottom);
        }

        return maxSoFar;
    }

    static async buildFromDescription(lines: Sequence<string>) {
        const grid = await lines.map(ln => ln.split("")).toArray();
        return new Contraption(grid);
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const contraption = await Contraption.buildFromDescription(lines);
    const beamStart = {x:0, y:0};
    return contraption.countEnergizedTiles(beamStart, Dir.Right);
}

export async function solvePart2(lines: Sequence<string>) {
    const contraption = await Contraption.buildFromDescription(lines);
    return contraption.maximumEnergizedTiles();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day16.txt";
    const lines = linesFromFile(filepath);
    console.log(await solvePart2(lines));
}