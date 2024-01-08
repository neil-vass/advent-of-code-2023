import {expect, describe, it, beforeEach} from "vitest";
import * as day24 from "../src/day24.js";
import {Sequence} from "../src/sequence.js";

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
        const position = {x: 19n, y: 13n, z: 30n};
        const velocity = {x: -2n, y:  1n, z: -2n};
        expect(day24.parseHailstone(line)).toStrictEqual(new day24.Hailstone(position, velocity));
    });

    it("Finds where paths cross", () => {
        const a = day24.parseHailstone("19, 13, 30 @ -2, 1, -2");
        const b = day24.parseHailstone("18, 19, 22 @ -1, -1, -2");
        const intersection = day24.pathsCross(a, b);
        expect(intersection).toStrictEqual({x: 14n, y: 15n, z: expect.any(BigInt)});
    });

    it("Predicts paths cross in future", () => {
        const a = day24.parseHailstone("19, 13, 30 @ -2, 1, -2");
        const b = day24.parseHailstone("20, 25, 34 @ -2, -2, -4");
        const intersection = day24.pathsCross(a, b);
        expect(intersection).toStrictEqual({x: 11n, y: 16n, z: expect.any(BigInt)});
        expect(day24.pathsCrossInFuture(a, b, intersection!)).toBe(true);
    });

    it("Predicts paths cross in past", () => {
        // Hailstones' paths crossed in the past for hailstone B.
        const a = day24.parseHailstone("20, 25, 34 @ -2, -2, -4");
        const b = day24.parseHailstone("20, 19, 15 @ 1, -5, -3");
        const intersection = day24.pathsCross(a, b);
        expect(day24.pathsCrossInFuture(a, b, intersection!)).toBe(false);
    });

    it("Identifies parallel paths", () => {
        const a = day24.parseHailstone("18, 19, 22 @ -1, -1, -2");
        const b = day24.parseHailstone("20, 25, 34 @ -2, -2, -4");
        const intersection = day24.pathsCross(a, b);
        expect(intersection).toBeNull();
    });

    it("Decides whether pairs intersect within test area", async () => {
        const testAreaMin = {x: 7n, y: 7n, z: 0n};
        const testAreaMax = {x: 27n, y: 27n, z: 0n};
        expect(await day24.intersectionsWithinTestArea(testAreaMin, testAreaMax, exampleLines)).toBe(2);
    });

    it("Solves example", async () => {
        expect(await day24.solvePart1(7n, 27n, exampleLines)).toBe(2);
    });
});

describe("Part 2", () => {
    it("Predicts intersections in 3D", () => {
        const hailstone = day24.parseHailstone("20, 19, 15 @ 1, -5, -3");
        const rock = day24.parseRock("24, 13, 10 @ -3, 1, 2");
        const intersection = day24.pathsCross3D(hailstone, rock);
        expect(intersection).toStrictEqual({ time: 1n, pos: { x: 21n, y: 14n, z: 12n }});
    });

    it("Finds path for rock", async () => {
        const rock = await day24.findPathForRock(exampleLines);
        const expectedRock = day24.parseRock("24, 13, 10 @ -3, 1, 2");
        expect(rock).toStrictEqual(expectedRock);
    });
});