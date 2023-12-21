import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

let cacheHits = 0;
let cacheMiss = 0;
// I've tried doing this using a decorator, to mimic the Python functools "@cache" decorator.
// That's because:
// 1. It's neater code (method can just do its work, with caching logic elsewhere)
// 2. I'm keen to learn lots of TypeScript (haven't seen decorators before).
// This is using the official decorators from TypeScript 5, not the experimental ones available
// in earlier versions.
// See https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators
function memoize(decoratedMethod: Function, context: ClassMethodDecoratorContext) {
    const cacheCollection = new WeakMap<object, Map<string, any>>();

    if (context.kind === "method") {
        return function (this: any, ...args: any[]) {
            if (!cacheCollection.has(this)) {
                cacheCollection.set(this, new Map<string, any>());
            }
            const cache = cacheCollection.get(this)!;
            const hashKey = JSON.stringify(args);

            if (cache.has(hashKey)) {
                cacheHits++;
                return cache.get(hashKey);
            } else {
                cacheMiss++;
                const result = decoratedMethod.apply(this, args);
                cache.set(hashKey, result);
                return result;
            }
        }
    }
}

class BetterSet extends Set<number> {
    union(other: BetterSet)  {
        other.forEach(n => this.add(n));
    }
}

type Pos = { x: number, y: number };

export class Garden {
    private constructor(readonly grid: string[][], readonly start: Pos) {}

    isInsideBounds(pos: Pos) {
        return (pos.x >= 0 && pos.x < this.grid.length &&
                pos.y >= 0 && pos.y < this.grid[0].length);
    }

    isPlot(pos: Pos) {
        return this.isInsideBounds(pos) && this.grid[pos.x][pos.y] !== "#";
    }

    neighbours(pos: Pos) {
        const directions = [{x:pos.x-1, y:pos.y}, {x:pos.x+1, y:pos.y}, {x:pos.x, y:pos.y-1}, {x:pos.x, y:pos.y+1}];
        return directions.filter(d => this.isPlot(d));
    }

    @memoize
    private plotsReachable(from: Pos, steps: number): BetterSet {
        const hash = (pos: Pos) => (pos.x * 10000) + pos.y;
        if (steps === 1) {
            return new BetterSet(this.neighbours(from).map(hash));
        }

        let result = new BetterSet();
        for (const n of this.neighbours(from)) {
            result.union(this.plotsReachable(n, steps-1));
        }
        return result;
    }

    numPlotsReachable(steps: number) {
        const result = this.plotsReachable(this.start, steps);
        console.log(`cache hits: ${cacheHits}, misses: ${cacheMiss}`)
        return result.size;
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
}


export async function solvePart1(lines: Sequence<string>) {
    const garden = await Garden.buildFromDescription(lines);
    return garden.numPlotsReachable(64);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day21.txt");
    console.log(await solvePart1(lines));
}