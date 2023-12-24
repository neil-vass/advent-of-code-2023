import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

export type Vector = {x: bigint, y: bigint, z: bigint};

export class Hailstone {
    constructor(readonly position: Vector, readonly velocity: Vector) {}
}

export function parseHailstone(s: string) {
    const m = s.match(/^(-?\d+),\s+(-?\d+),\s+(-?\d+)\s+@\s+(-?\d+),\s+(-?\d+),\s+(-?\d+)$/);
    if (m === null) throw new Error(`Unexpected line format: ${s}`);
    const [, xpos, ypos, zpos, xvel, yvel, zvel] = m;
    const position = {x: BigInt(xpos), y: BigInt(ypos),  z: BigInt(zpos)};
    const velocity = {x: BigInt(xvel), y: BigInt(yvel),  z: BigInt(zvel)};
    return new Hailstone(position, velocity);
}

export function pathsCross(a: Hailstone, b: Hailstone): Vector | null {
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const [x1, y1] = [a.position.x, a.position.y];
    const [x2, y2] = [a.position.x + a.velocity.x, a.position.y + a.velocity.y];

    const [x3, y3] = [b.position.x, b.position.y];
    const [x4, y4] = [b.position.x + b.velocity.x, b.position.y + b.velocity.y];

    try {
        const Px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
            ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

        const Py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
            ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

        return {x: Px, y: Py, z: 0n}
    } catch (RangeError) {
        return null;
    }
}

export function pathsCrossInFuture(a: Hailstone, b: Hailstone, intersection: Vector) {
    if (intersection.x > a.position.x && a.velocity.x <= 0) return false;
    if (intersection.x < a.position.x && a.velocity.x >= 0) return false;

    if (intersection.x > b.position.x && b.velocity.x <= 0) return false;
    if (intersection.x < b.position.x && b.velocity.x >= 0) return false;

    if (intersection.y > a.position.y && a.velocity.y <= 0) return false;
    if (intersection.y < a.position.y && a.velocity.y >= 0) return false;

    if (intersection.y > b.position.y && b.velocity.y <= 0) return false;
    if (intersection.y < b.position.y && b.velocity.y >= 0) return false;

    return true;
}


export async function intersectionsWithinTestArea(testAreaMin: Vector, testAreaMax: Vector, lines: Sequence<string>) {
    const hailstones = await lines.map(parseHailstone).toArray();

    const isWithinArea = (v: Vector) => (v.x >= testAreaMin.x && v.x <= testAreaMax.x) &&
                                        (v.y >= testAreaMin.y && v.y <= testAreaMax.y);

    let count = 0;
    for (let i=0; i < hailstones.length-1; i++) {
       for (let j=i+1; j < hailstones.length; j++) {
           const [a, b] = [hailstones[i], hailstones[j]];
           const intersection = pathsCross(a, b);
           if (intersection === null) continue;
           if (isWithinArea(intersection) && pathsCrossInFuture(a, b, intersection)) count++;
       }
    }

    return count;
}

export async function solvePart1(min: bigint, max: bigint, lines: Sequence<string>) {
    const testAreaMin = {x: min, y: min, z: 0n};
    const testAreaMax = {x: max, y: max, z: 0n};
    return intersectionsWithinTestArea(testAreaMin, testAreaMax, lines);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const lines = linesFromFile("./data/day24.txt");
    console.log(await solvePart1(200000000000000n, 400000000000000n, lines));
}