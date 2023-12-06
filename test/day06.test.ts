import {expect, describe, it} from "vitest";
import * as day06 from "../src/day06.js";
import {Sequence} from "../src/sequence.js";

describe("Part 1", () => {
    it("Counts ways to win for 1 race", () => {
        expect(day06.waysToWin(7, 9)).toBe(4);
    });

    it("Solves part 1 example", async () => {
        const lines = new Sequence([
            "Time:      7  15   30",
            "Distance:  9  40  200"
        ])
        expect(await day06.solvePart1(lines)).toBe(288);
    });
});

describe("Part 2", () => {
    it("Solves part 2 example", async () => {
        const lines = new Sequence([
            "Time:      7  15   30",
            "Distance:  9  40  200"
        ])
        expect(await day06.solvePart2(lines)).toBe(71503);
    });
});