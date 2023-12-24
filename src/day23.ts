import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {FifoQueue, Stack} from "./graphSearch.js";

export type Pos = { x: number, y: number };
type HashedPos = string;
const hash = (pos: Pos) => pos.x + "," + pos.y;

export class HikingMap {
    readonly digraph = new Map<HashedPos, Array<{ destination: HashedPos, cost: number }>>();

    private constructor(readonly grid: string[][], readonly start: Pos, readonly goal: Pos, readonly slippySlopes: boolean) {
        this.generateDigraph();
    }


    isInsideBounds(pos: Pos) {
        return (pos.x >= 0 && pos.x < this.grid.length &&
                pos.y >= 0 && pos.y < this.grid[0].length);
    }

    canMoveTo(next: Pos, cameFrom: Pos) {
        return this.isInsideBounds(next) &&
            hash(next) !== hash(cameFrom) &&
            this.grid[next.x][next.y] !== "#";
    }

    neighbours(current: Pos, cameFrom: Pos) {
        const {x,y} = current;
        let options = [{x: x-1, y}, {x, y: y+1}, {x: x+1, y}, {x, y: y-1}];

        if(this.slippySlopes) {
            switch (this.grid[x][y]) {
                case "^": options = [{x: x-1, y}]; break;
                case ">": options = [{x, y: y+1}]; break;
                case "v": options = [{x: x+1, y}]; break;
                case "<": options = [{x, y: y-1}]; break;
            }
        }

        return options.filter(next => this.canMoveTo(next, cameFrom));
    }

    private generateDigraph() {
        this.digraph.set("start", []);
        this.digraph.set(hash(this.goal), []);

        const frontier = new FifoQueue<{ origin: HashedPos, curr: Pos, prev: Pos, steps: number }>();
        frontier.push({ origin: "start", curr: this.start, prev: this.start, steps: 0 });

        const neighboursExploredFrom = new Map<HashedPos, Set<HashedPos>>();

        while (!frontier.isEmpty()) {
            const path = frontier.pull()!;
            const hashCurrent = hash(path.curr);

            if (hashCurrent === hash(this.goal)) {
                this.digraph.get(path.origin)!.push({ destination: hashCurrent, cost: path.steps });
            }

            const neighbours = this.neighbours(path.curr, path.prev);

            if (neighbours.length === 1) {
                // Just keep going till we have a choice to make.
                frontier.push({ origin: path.origin, curr: neighbours[0], prev: path.curr, steps: path.steps +1 });
            } else if (neighbours.length > 1) {
                // A decision point; this will be a node on the digraph.
                if (!this.digraph.has(hashCurrent)) {
                    this.digraph.set(hashCurrent, []);
                    neighboursExploredFrom.set(hashCurrent, new Set());
                }
                this.digraph.get(path.origin)!.push({ destination: hashCurrent, cost: path.steps });
                for (const next of neighbours) {
                    if (!neighboursExploredFrom.get(hashCurrent)!.has(hash(next))) {
                        frontier.push({origin: hashCurrent, curr: next, prev: path.curr, steps: 1});
                        neighboursExploredFrom.get(hashCurrent)!.add(hash(next));
                    }
                }
            }
        }
    }

    private findLongestPath() {
        let lastT = new Date();
        const frontier = new Stack<{ head: HashedPos, visited: Set<HashedPos>, length: number }>();
        frontier.push({ head: "start", visited: new Set<HashedPos>(["start"]), length: 0 });

        const reached = new Map<string, number>();
        let longestSoFar = 0;
        let iterations = 0;

        while (!frontier.isEmpty()) {
            iterations++;
            const path = frontier.pull()!;

            if (iterations % 1000_000 === 0) {
                let newT = new Date();
                console.log(`iteration ${iterations} took ${(newT-lastT)/1000} seconds`);
                lastT = newT;
               // console.log(`exploring ${path.head}, length ${path.length}, visited ${path.visited.size}: ${JSON.stringify(Array.from(path.visited))}`)
            }

            if (path.head === hash(this.goal)) {
                if (path.length > longestSoFar) {
                    longestSoFar = path.length;
                }
                continue;
            }

            const pathKey = Array.from(path.visited).sort().toString() + ":" + path.head;
            const pathLengthLastTime = reached.get(pathKey)
            if (pathLengthLastTime !== undefined && pathLengthLastTime > path.length) {
                continue;
            }
            reached.set(pathKey, path.length);

            for (const neighbour of this.digraph.get(path.head)!) {
                if (!path.visited.has(neighbour.destination)) {
                    const head = neighbour.destination;
                    const visited = new Set(path.visited);
                    visited.add(head);
                    const length = path.length + neighbour.cost;
                    frontier.push({ head, visited, length });
                }
            }
        }

        return longestSoFar;
    }

    longestHike() {
        return this.findLongestPath();
    }

    static async buildFromDescription(lines: Sequence<string>, slippySlopes=true) {
        const grid = await lines.map(row => row.split("")).toArray();
        const start = { x: 0, y: 1};
        const goal = { x: grid.length-1, y: grid[0].length-2 }
        return new HikingMap(grid, start, goal, slippySlopes);
    }
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day23.txt");
    const hikingMap = await HikingMap.buildFromDescription(lines, false);
    console.log(hikingMap.longestHike());
}