import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

type Pos = { x: number, y: number };
type ConnectionsList = Array<Pos>;
type GridRow = Array<ConnectionsList>;
type Grid = Array<GridRow>;

export class PipeMap {

    private constructor(readonly grid: Grid,
                        readonly start: Pos) {
        this.removeBlockedConnections();
    }

    private removeBlockedConnections() {
        // This is O(scary), but we only run it once.
        for (let rowNum=1; rowNum < this.grid.length-1; rowNum++) {
            for (let colNum=1; colNum < this.grid[0].length-1; colNum++) {
                const currentConnections = this.grid[rowNum][colNum];
                const unblockedConnections = new Array<Pos>();
                for (const n of currentConnections) {
                    const neighboursConnections = this.grid[n.x][n.y];
                    for (const nc of neighboursConnections) {
                        if (nc.x === rowNum && nc.y === colNum) {
                            unblockedConnections.push(n);
                        }
                    }
                }
                this.grid[rowNum][colNum] = unblockedConnections;
            }
        }
    }

    neighbours(tile: Pos) {
        return this.grid[tile.x][tile.y];
    }

    tilesInLoop() {
        let current = this.start;
        let loopSoFar = new Array<Pos>();
        let stepCount = 0;
        while (true) {
            let options = this.grid[current.x][current.y];
            if (loopSoFar.length > 0) {
                const cameFrom = loopSoFar.at(-1)!;
                options = options.filter(n => !(n.x === cameFrom.x && n.y === cameFrom.y));
            }
            const next = options[0];
            loopSoFar.push(current);
            current = next;
            stepCount++;
            if (current.x === this.start.x && current.y === this.start.y) break;
        }
        return loopSoFar;
    }

    stepsToFarthestPoint() {
        const loop = this.tilesInLoop();
        return loop.length / 2;
    }


    private lookRight(lookingFrom: Pos, direction: Pos, loop: Pos[], seen: Set<string>) {
        if (direction.x < 0) {
            const neighboursLookingRight = loop.filter(t => t.x === lookingFrom.x && t.y > lookingFrom.y).map(t => t.y);
            const firstNeighbourY = Math.min(...neighboursLookingRight);
            const x = lookingFrom.x;
            for (let y = lookingFrom.y+1; y < firstNeighbourY; y++) {
                seen.add(JSON.stringify({x, y}));
            }

        } else if (direction.y > 0) {
            const neighboursLookingRight = loop.filter(t => t.x > lookingFrom.x && t.y === lookingFrom.y).map(t => t.x);
            const firstNeighbourX = Math.min(...neighboursLookingRight);
            const y = lookingFrom.y;
            for (let x = lookingFrom.x+1; x < firstNeighbourX; x++) {
                seen.add(JSON.stringify({x, y}));
            }

        } else if (direction.x > 0) {
            const neighboursLookingRight = loop.filter(t => t.x === lookingFrom.x && t.y < lookingFrom.y).map(t => t.y);
            const firstNeighbourY = Math.max(...neighboursLookingRight);
            const x = lookingFrom.x;
            for (let y = lookingFrom.y-1; y > firstNeighbourY; y--) {
                seen.add(JSON.stringify({x, y}));
            }


        } else if (direction.y < 0) {
            const neighboursLookingRight = loop.filter(t => t.x < lookingFrom.x && t.y === lookingFrom.y).map(t => t.x);
            const firstNeighbourX = Math.max(...neighboursLookingRight);
            const y = lookingFrom.y;
            for (let x = lookingFrom.x-1; x > firstNeighbourX; x--) {
                seen.add(JSON.stringify({x, y}));
            }
        }
    }

    private isClockwise(loop: Array<Pos>) {
        let sum = 0;
        for (let i = 0; i < loop.length - 1; i++) {
            sum += (loop[i + 1].x - loop[i].x) * (loop[i + 1].y + loop[i].y);
        }
        return (sum > 0);
    }

    areaEnclosedByLoop() {
        const loop = this.tilesInLoop();
        if (!this.isClockwise(loop)) loop.reverse();

        // Step round the loop, looking right. Say what you see.
        const enclosed = new Set<string>();
        for (const [idx, current] of loop.entries()) {
            const cameFrom = idx === 0 ? loop.at(-1)! : loop[idx-1];
            const lastDirection = {x: current.x - cameFrom.x, y: current.y - cameFrom.y};
            this.lookRight(current, lastDirection, loop, enclosed);

            const next = idx === loop.length-1 ? loop[0] : loop[idx+1];
            const nextDirection = {x: next.x - current.x, y: next.y - current.y};
            this.lookRight(current, nextDirection, loop, enclosed);
        }
        return enclosed.size;
    }

    static async buildFromDescription(lines: Sequence<string>) {
        // Main work is to build a grid of connections.
        // Pad with "." for easier bounds checking.
        const paddingTile = new Array<Pos>();
        const grid = new Array<GridRow>();
        let start: Pos | null = null;
        let rowNum = 0;

        for await (const line of lines) {
            rowNum++;
            const row = new Array<ConnectionsList>();
            let colNum = 0;
            row.push(paddingTile);
            for await (const tileType of line) {
                colNum++;
                row.push(tileConnections(tileType, rowNum, colNum));
                if (tileType === "S") start = {x: rowNum, y: colNum};
            }
            row.push(paddingTile);
            grid.push(row);
        }

        const paddingRow = Array.from(grid[0], () => paddingTile);
        grid.unshift(paddingRow);
        grid.push(paddingRow);
        if (start === null) throw new Error(`Didn't find start tile`);
        return new PipeMap(grid, start);
    }
}

export function tileConnections(tileType: string, tileX: number, tileY: number): ConnectionsList {
    switch (tileType) {
        case "|": return [{x: tileX-1, y: tileY}, {x: tileX+1, y: tileY}];
        case "-": return [{x: tileX, y: tileY+1}, {x: tileX, y: tileY-1}];
        case "L": return [{x: tileX-1, y: tileY}, {x: tileX, y: tileY+1}];
        case "J": return [{x: tileX-1, y: tileY}, {x: tileX, y: tileY-1}];
        case "7": return [{x: tileX+1, y: tileY}, {x: tileX, y: tileY-1}];
        case "F": return [{x: tileX, y: tileY+1}, {x: tileX+1, y: tileY}];
        case ".": return new Array<Pos>();
        case "S": return [{x: tileX-1, y: tileY}, {x: tileX, y: tileY+1}, {x: tileX+1, y: tileY}, {x: tileX, y: tileY-1}];
        default: throw new Error(`Unknown tile type: ${tileType}`);
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const pipeMap = await PipeMap.buildFromDescription(lines);
    return pipeMap.stepsToFarthestPoint();
}

export async function solvePart2(lines: Sequence<string>) {
    const pipeMap = await PipeMap.buildFromDescription(lines);
    return pipeMap.areaEnclosedByLoop();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day10.txt";
    console.log(await solvePart2(linesFromFile(filepath)));
}