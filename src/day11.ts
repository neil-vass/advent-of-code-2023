import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

type Pos = { x: number, y: number };

export function numEntriesSmallerThan(n: number, orderedArray: Array<number>) {
    for (let i=0; i < orderedArray.length; i++) {
        if (orderedArray[i] >= n) {
            return i;
        }
    }
    return orderedArray.length;
}

export class StarMap {
    private constructor(readonly galaxies: Map<number, Pos>,
                        readonly emptyRows: Set<number>,
                        readonly emptyCols: Set<number>,
                        readonly expansionRate: number) {
        this.expand(expansionRate);
    }

    private expand(rate: number) {
        const emptyRowsAscending = [...this.emptyRows].sort((a,b) => a-b);
        const emptyColsAscending = [...this.emptyCols].sort((a,b) => a-b);

        for (const g of this.galaxies.values()) {
            g.x += numEntriesSmallerThan(g.x, emptyRowsAscending) * (rate-1);
            g.y += numEntriesSmallerThan(g.y, emptyColsAscending) * (rate-1);
        }
    }

    shortestPathLength(fromGalaxy: number, toGalaxy: number) {
        const f: Pos = this.galaxies.get(fromGalaxy)!;
        const t: Pos = this.galaxies.get(toGalaxy)!;
        return Math.abs(f.x - t.x) + Math.abs(f.y - t.y);
    }

    sumOfShortestPaths() {
        const galaxyCount = this.galaxies.size;
        let sum = 0;
        for (let from = 1; from < galaxyCount; from++) {
            for (let to = from+1; to <= galaxyCount; to++) {
                sum += this.shortestPathLength(from, to);
            }
        }
        return sum;
    }

    static async buildFromDescription(lines: Sequence<string>, expansionRate=2) {
        const galaxies = new Map<number, Pos>();
        const emptyRows = new Set<number>();
        let emptyCols: Set<number> | null = null;

        let galaxyCount = 0;
        let x = 0;

        for await (const line of lines) {
            if (emptyCols === null) {
                emptyCols = new Set(Array.from(line, (val, idx) => idx));
            }
            emptyRows.add(x);
            for (let y = 0; y < line.length; y++) {
                if (line[y] === "#") {
                    galaxyCount++;
                    galaxies.set(galaxyCount, {x,y});
                    emptyRows.delete(x);
                    emptyCols.delete(y);
                }
            }
            x++;
        }

        if (emptyCols === null) throw new Error(`Empty map!`);
        return new StarMap(galaxies, emptyRows, emptyCols, expansionRate);
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const starMap = await StarMap.buildFromDescription(lines);
    return starMap.sumOfShortestPaths();
}

export async function solvePart2(lines: Sequence<string>, expansionRate: number) {
    const starMap = await StarMap.buildFromDescription(lines, expansionRate);
    return starMap.sumOfShortestPaths();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day11.txt";
    console.log(await solvePart2(linesFromFile(filepath), 1_000_000));
}