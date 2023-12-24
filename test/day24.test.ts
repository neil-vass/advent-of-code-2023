import {expect, describe, it, beforeEach} from "vitest";
import * as day24 from "../src/day24.js";
import {Sequence} from "../src/sequence.js";
import {before} from "node:test";

let exampleLines: Sequence<string>;
beforeEach(() => {
    exampleLines = new Sequence([
        "19, 13, 30 @ -2,  1, -2",
        "18, 19, 22 @ -1, -1, -2",
        "20, 25, 34 @ -2, -2, -4",
        "12, 31, 28 @ -1, -2, -1",
        "20, 19, 15 @  1, -5, -3",
    ])
});

describe("Part 1", () => {
    it("Parses input lines", () => {
        const line = "19, 13, 30 @ -2,  1, -2";
        const position = {x: 19, y: 13, z: 30};
        const velocity = {x: -2, y:  1, z: -2};
        expect(day24.parseHailstone(line)).toStrictEqual(new day24.Hailstone(position, velocity));
    });
});