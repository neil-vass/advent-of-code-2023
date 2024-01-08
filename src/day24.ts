import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

export type Vector = {x: bigint, y: bigint, z: bigint};

function vecToStr(v: Vector) {
    return `{x: ${String(v.x)}, y: ${String(v.y)}, z: ${String(v.z)}}`;
}

export class Hailstone {
    constructor(readonly position: Vector, readonly velocity: Vector) {}
}

export class Rock extends Hailstone {}

export function parseHailstone(s: string) {
    const m = s.match(/^(-?\d+),\s+(-?\d+),\s+(-?\d+)\s+@\s+(-?\d+),\s+(-?\d+),\s+(-?\d+)$/);
    if (m === null) throw new Error(`Unexpected line format: ${s}`);
    const [, xpos, ypos, zpos, xvel, yvel, zvel] = m;
    const position = {x: BigInt(xpos), y: BigInt(ypos),  z: BigInt(zpos)};
    const velocity = {x: BigInt(xvel), y: BigInt(yvel),  z: BigInt(zvel)};
    return new Hailstone(position, velocity);
}

export const parseRock = parseHailstone;

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


export function pathsCross3D(a: Hailstone, b: Hailstone) {
    const intersection = pathsCross(a, b);
    if (intersection === null) return null;

    let time = 0n;
    if (a.velocity.x !== 0n) {
        time = (intersection.x - a.position.x) / a.velocity.x;
    } else {
        time = (intersection.y - a.position.y) / a.velocity.y;
    }

    const az = a.position.z + (a.velocity.z * time);
    const bz = b.position.z + (b.velocity.z * time);
    if (az !== bz) return null;

    intersection.z = az;
    return { time, pos: intersection }
}

export async function findPathForRock(lines: Sequence<string>) {
    const hailstones = await lines.map(parseHailstone).toArray();

    const [a, b, c] = hailstones;

    // const rock = parseRock("24, 13, 10 @ -3, 1, 2"); <-- actual rock answer.

    // This doesn't work because: `pathsCross3D` is _actually_ checking whether objects collide.
    // for this test: rock and hailstone pass the same point at different times.
    // Let's change this ... maybe { a_time, b_time, pos }?
    const rock = new Rock({x:9n, y:18n, z:20n}, {x:-3n, y:1n, z:2n})
    const a_collision = pathsCross3D(a, rock)!;
    console.log(`a: time=${String(a_collision.time)}, pos=${vecToStr(a_collision.pos)}`)

    const b_collision = pathsCross3D(b, rock)!;
    console.log(`b: time=${String(b_collision.time)}, pos=${vecToStr(b_collision.pos)}`)

    const c_collision = pathsCross3D(c, rock)!;
    console.log(`c: time=${String(c_collision.time)}, pos=${vecToStr(c_collision.pos)}`)
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