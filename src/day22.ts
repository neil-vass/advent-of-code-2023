import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";


export type Vector = { x: number, y: number, z: number };
export type hashedXY = string;

const hash = (x: number, y: number) : hashedXY => `(${x},${y})`;
const ascending = (left: number, right: number) => left - right;

export class Brick {
    readonly restingOn = new Set<Brick>();
    readonly supporting = new Set<Brick>();
    constructor(readonly from: Vector, readonly to: Vector) {}

    xyPositions() : hashedXY[] {
        if (this.from.x !== this.to.x) {
            const [xMin, xMax] = [this.from.x, this.to.x].sort(ascending);
            const result = new Array<string>();
            for (let x=xMin; x<=xMax; x++) {
                result.push(hash(x,this.from.y));
            }
            return result;
        } else {
            const [yMin, yMax] = [this.from.y, this.to.y].sort(ascending);
            const result = new Array<string>();
            for (let y=yMin; y<=yMax; y++) {
                result.push(hash(this.from.x, y));
            }
            return result;
        }
    }

    zHeightOfBase() {
        return Math.min(this.from.z, this.to.z);
    }

    zHeightOfTop() {
        return Math.max(this.from.z, this.to.z);
    }

    verticalSize() {
        return Math.abs(this.from.z - this.to.z) + 1;
    }

    fallTo(supportHeight: number) {
        const fallDistance = this.zHeightOfBase() - supportHeight - 1;
        this.from.z -= fallDistance;
        this.to.z -= fallDistance;
    }

    static buildFromDescription(line: string) {
        const m = line.match(/^(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)$/);
        if (m === null) throw new Error(`Unrecognized format: ${line}`);
        const from = { x: +m[1], y: +m[2], z: +m[3] };
        const to = { x: +m[4], y: +m[5], z: +m[6] };
        return new Brick(from, to);
    }
}

export class Stack {
    readonly topBricks = new Map<hashedXY, Brick>();
    readonly bricks = new Array<Brick>();

    private constructor() {}

    add(fallingBrick: Brick) {
        let stoppedBy = new Array<Brick>();

        for (const xy of fallingBrick.xyPositions()) {
            const topBrickAtThisPos = this.topBricks.get(xy);

            if (topBrickAtThisPos !== undefined) {
                if (stoppedBy.length === 0 || stoppedBy[0].zHeightOfTop() < topBrickAtThisPos.zHeightOfTop()) {
                    stoppedBy = [topBrickAtThisPos];
                } else if (stoppedBy[0].zHeightOfTop() === topBrickAtThisPos.zHeightOfTop()) {
                    stoppedBy.push(topBrickAtThisPos);
                }
            }
        }

        for (const xy of fallingBrick.xyPositions()) {
            this.topBricks.set(xy, fallingBrick);
        }

        for (const supportBrick of stoppedBy) {
            fallingBrick.restingOn.add(supportBrick);
            supportBrick.supporting.add(fallingBrick);
        }

        const supportHeight = stoppedBy.length === 0 ? 0 : stoppedBy[0].zHeightOfTop();
        fallingBrick.fallTo(supportHeight);
        this.bricks.push(fallingBrick);
    }

    safeDisintegrationCount() {
        let count = 0;
        for (const brick of this.bricks) {
            count++;
            for (const supportedBrick of brick.supporting) {
                if (supportedBrick.restingOn.size === 1) {
                    count--;
                    break;
                }
            }
        }
        return count;
    }


    static async buildFromDescription(lines: Sequence<string>) {
        const stack = new Stack();
        const fallingBricks = await lines.map(Brick.buildFromDescription).toArray();
        fallingBricks.sort((a,b) => a.zHeightOfBase() - b.zHeightOfBase());
        for (const brick of fallingBricks) {
            stack.add(brick);
        }
        return stack;
    }
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day22.txt");
    const stack = await Stack.buildFromDescription(lines);
    console.log(stack.safeDisintegrationCount());
}