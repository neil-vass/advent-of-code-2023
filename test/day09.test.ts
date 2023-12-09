import {expect, describe, it} from "vitest";
import * as day09 from "../src/day09.js";
import {Sequence} from "../src/sequence.js";

describe("Part 1", () => {
    it("Solves first part of example", () => {
        expect(day09.predictNextValue([ 0, 3, 6, 9, 12, 15 ])).toBe(18);
    });

    it("Solves whole example", async () => {
        const lines = new Sequence([
            "0 3 6 9 12 15",
            "1 3 6 10 15 21",
            "10 13 16 21 30 45"
        ])
        expect(await day09.solvePart1(lines)).toBe(114);
    });
});


describe("Part 2", () => {
    it("Solves first part of example", () => {
        expect(day09.predictPreviousValue([ 0, 3, 6, 9, 12, 15 ])).toBe(-3);
        expect(day09.predictPreviousValue([ 1, 3, 6, 10, 15, 21 ])).toBe(0);
        expect(day09.predictPreviousValue([ 10, 13, 16, 21, 30, 45 ])).toBe(5);
    });

    it("Solves whole example", async () => {
        const lines = new Sequence([
            "0 3 6 9 12 15",
            "1 3 6 10 15 21",
            "10 13 16 21 30 45"
        ])
        expect(await day09.solvePart2(lines)).toBe(2);
    });
});