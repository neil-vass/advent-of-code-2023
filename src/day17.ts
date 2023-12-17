import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";
import {MinPriorityQueue} from "./graphSearch.js";

type Pos = { x: number, y: number };

export enum Dir { Up, Right, Down, Left};

export class HeadOfPath {
    constructor(readonly pos: Pos,
                readonly costSoFar = 0,
                readonly moveDirection = Dir.Up,
                readonly stepsInSameDirection = 0) {}

    private reverseDirection: Dir = (this.moveDirection+2) % 4;

    private neighbourPosition(dir: Dir) {
        switch(dir) {
            case Dir.Up: return { x: this.pos.x-1, y: this.pos.y };
            case Dir.Right: return { x: this.pos.x, y: this.pos.y+1 };
            case Dir.Down: return { x: this.pos.x+1, y: this.pos.y };
            case Dir.Left: return { x: this.pos.x, y: this.pos.y-1 };
        }
    }

    // Rules: can't take more than 3 steps in the same direction,
    // can't backtrack. This class doesn't know about grid's size.
    possibleNextSteps() {
        const directions = new Set([Dir.Up, Dir.Right, Dir.Down, Dir.Left]);
        if (this.stepsInSameDirection > 0) {
            directions.delete(this.reverseDirection);
        }
        if (this.stepsInSameDirection >= 3) {
            directions.delete(this.moveDirection);
        }

        const options = new Array<{pos: Pos, dir: Dir}>();
        for (const dir of directions) {
            options.push({
                pos: this.neighbourPosition(dir), dir
            });
        }
        return options;
    }
}

export class RouteFinder {
    private constructor(readonly trafficMap: number[][],
                        readonly start: Pos,
                        readonly goal: Pos) {}

    isInsideBounds(pos: Pos) {
        return (pos.x >= 0 && pos.x < this.trafficMap.length &&
                pos.y >= 0 && pos.y < this.trafficMap[0].length);
    }

    costForEntering(pos: Pos) {
        return this.trafficMap[pos.x][pos.y];
    }

    // Possible next moves you could make.
    neighbours(current: HeadOfPath): Array<HeadOfPath> {
        const options = new Array<HeadOfPath>();
        for (const {pos, dir} of current.possibleNextSteps()) {
            if (this.isInsideBounds(pos)) {
                const cost = current.costSoFar + this.costForEntering(pos);

                const turning = (dir !== current.moveDirection)
                const stepsInSameDirection = turning ? 1 : current.stepsInSameDirection+1;

                options.push(new HeadOfPath(pos, cost, dir, stepsInSameDirection));
            }
        }
        return options;
    }

    // Optimistic estimate: we can go straight there with no detours.
    // Assume every step on that route costs 1.
    heuristic(from: Pos, to: Pos) {
        return Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
    }

    static hashState(p: HeadOfPath) {
        return JSON.stringify({
            pos: p.pos,
            moveDirection: p.moveDirection,
            stepsInSameDirection: p.stepsInSameDirection
        });
    }

    static positionFromHashedState(hashedState: string) {
        const state = JSON.parse(hashedState);
        return state.pos;
    }

    // Adapted from the general A_starSearch version in ./src/graphSearch.
    private bestPathToGoal(start=this.start, goal=this.goal) {
        // Where might we explore next?
        const frontier = new MinPriorityQueue<HeadOfPath>();
        const startOfPath = new HeadOfPath(start);
        frontier.push(startOfPath, 0);

        // To know where we've visited before: Have we been to this pos,
        // with the same moveDirection and stepsInThisDirection?
        // If we come back to the same position but can now turn direction sooner,
        // we're in a different situation.
        const visited = new Map<string, HeadOfPath>();
        let winningPath: HeadOfPath | null = null;
        visited.set(RouteFinder.hashState(startOfPath), startOfPath);

        while (!frontier.isEmpty()) {
            const current = frontier.pull()!;
            if (current.pos.x === goal.x && current.pos.y === goal.y) {
                winningPath = current;
                break;
            }

            for (const nextStep of this.neighbours(current)) {
                const newCost = nextStep.costSoFar;
                const oldCost = visited.get(RouteFinder.hashState(nextStep))?.costSoFar;

                // If we haven't been here before, _or_ if we've found a cheaper way to get here
                if (oldCost === undefined || newCost < oldCost) {
                    const priority = newCost + this.heuristic(nextStep.pos, goal);
                    frontier.push(nextStep, priority);
                    visited.set(RouteFinder.hashState(nextStep), nextStep);
                }
            }
        }

        // There'll be at most one entry in visited at the goal position.
        // Either we've found the best path to it, or it's not possible to reach it.
        if (winningPath === null) throw new Error(`No route from start to goal`);
        return winningPath;
    }

    heatLossOnBestPath() {
        const path = this.bestPathToGoal();
        return path.costSoFar;
    }

    static async buildFromDescription(lines: Sequence<string>) {
        const numbers = lines.map(ln => ln.split("").map(Number));
        const trafficMap = await numbers.toArray();
        const start = { x: 0, y: 0 };
        const goal = { x: trafficMap.length-1, y: trafficMap[0].length-1 };
        return new RouteFinder(trafficMap, start, goal);
    }
}


export async function solvePart1(lines: Sequence<string>) {
    const routeFinder = await RouteFinder.buildFromDescription(lines);
    return routeFinder.heatLossOnBestPath();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day17.txt";
    const lines = linesFromFile(filepath);
    console.log(await solvePart1(lines));

}