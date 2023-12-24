import {linesFromFile} from "./helpers.js";
import {Sequence} from "./sequence.js";

export type Vector = {x: number, y: number, z: number};

export function parseHailstone(s: string) {
    const m = s.match(/^(-?\d+),\s+(-?\d+),\s+(-?\d+)\s+@\s+(-?\d+),\s+(-?\d+),\s+(-?\d+)$/);
    if (m === null) throw new Error(`Unexpected line format: ${s}`);
    const [,xpos, ypos, zpos, xvel, yvel, zvel] = m;
    const position = {x: +xpos, y: +ypos,  z: +zpos};
    const velocity = {x: +xvel, y: +yvel,  z: +zvel};
    return new Hailstone(position, velocity);
}

export class Hailstone {
    constructor(readonly position: Vector, readonly velocity: Vector) {}
}


export function fn(filepath: string) {
    return "Hello, World!";
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = "./data/day24.txt";
    console.log(fn(filepath));
}