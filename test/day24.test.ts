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
        const position = {x: 19, y: 13, z: 30};
        const velocity = {x: -2, y:  1, z: -2};
        expect(day24.parseHailstone(line)).toStrictEqual(new day24.Hailstone(position, velocity));
    });

    it("Finds where paths cross", () => {
        const a = day24.parseHailstone("19, 13, 30 @ -2, 1, -2");
        const b = day24.parseHailstone("18, 19, 22 @ -1, -1, -2");
        const intersection = day24.pathsCross(a, b);
        expect(intersection.x).toBeCloseTo(14.333);
        expect(intersection.y).toBeCloseTo(15.333);
    });

    it("Predicts paths cross in future", () => {
        const a = day24.parseHailstone("19, 13, 30 @ -2, 1, -2");
        const b = day24.parseHailstone("20, 25, 34 @ -2, -2, -4");
        const intersection = day24.pathsCross(a, b);
        expect(intersection.x).toBeCloseTo(11.667);
        expect(intersection.y).toBeCloseTo(16.667);
        expect(day24.pathsCrossInFuture(a, b, intersection)).toBe(true);
    });

    it("Predicts paths cross in past", () => {
        // Hailstones' paths crossed in the past for hailstone B.
        const a = day24.parseHailstone("20, 25, 34 @ -2, -2, -4");
        const b = day24.parseHailstone("20, 19, 15 @ 1, -5, -3");
        const intersection = day24.pathsCross(a, b);
        expect(day24.pathsCrossInFuture(a, b, intersection)).toBe(false);
    });

    it("Identifies parallel paths", () => {
        const a = day24.parseHailstone("18, 19, 22 @ -1, -1, -2");
        const b = day24.parseHailstone("20, 25, 34 @ -2, -2, -4");
        const intersection = day24.pathsCross(a, b);
        expect(intersection.x).toBe(-Infinity);
        expect(intersection.y).toBe(-Infinity);
        expect(day24.pathsCrossInFuture(a, b, intersection)).toBe(false);
    });

    it("Decides whether pairs intersect within test area", async () => {
        const testAreaMin = {x: 7, y: 7, z: 0};
        const testAreaMax = {x: 27, y: 27, z: 0};
        expect(await day24.intersectionsWithinTestArea(testAreaMin, testAreaMax, exampleLines)).toBe(2);
    });

    it("Solves example", async () => {
        expect(await day24.solvePart1(7, 27, exampleLines)).toBe(2);
    });

});