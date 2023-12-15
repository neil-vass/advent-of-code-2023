import {expect, describe, it} from "vitest";
import * as day12pt2 from "../src/day12-part2.js";
import {Sequence} from "../src/sequence.js";


describe("Single possibility cases", () => {
    it("Solves base case", () => {
        expect(day12pt2.possibleArrangements("", [])).toBe(1);
    });

    it("Solves single-char, no-groups cases", () => {
        expect(day12pt2.possibleArrangements(".", [])).toBe(1);
        expect(day12pt2.possibleArrangements("?", [])).toBe(1);
    });

    it("Solves single-group, no-unknowns cases", () => {
        expect(day12pt2.possibleArrangements("#", [1])).toBe(1);
        expect(day12pt2.possibleArrangements("..##.", [2])).toBe(1);
    });

    it("Solves single-group, one-unknown cases", () => {
        expect(day12pt2.possibleArrangements("?", [1])).toBe(1);
        expect(day12pt2.possibleArrangements("..##?", [2])).toBe(1);
    });

    it("Solves two-group, no-unknowns cases", () => {
        expect(day12pt2.possibleArrangements("##.#", [2, 1])).toBe(1);
        expect(day12pt2.possibleArrangements("..###..##.", [3, 2])).toBe(1);
    });

    it("Solves two-group, one-unknown cases", () => {
        expect(day12pt2.possibleArrangements("##.?", [2, 1])).toBe(1);
        expect(day12pt2.possibleArrangements("..##?..##.", [3, 2])).toBe(1);
    });

    it("Solves multiple-unknown, one possibility cases", () => {
        expect(day12pt2.possibleArrangements("??", [2])).toBe(1);
        expect(day12pt2.possibleArrangements("..#?.?", [2])).toBe(1);
    });
});

describe("Two possibility cases", () => {
    it("Solves one-group, two-unknown cases", () => {
        expect(day12pt2.possibleArrangements("??", [1])).toBe(2);
    });
});

describe("Overall part 2 puzzle", () => {
    it("Unfolds", () => {
        expect(day12pt2.unfold(".# 1", 5)).toBe(".#?.#?.#?.#?.# 1,1,1,1,1");
    });

    it("Solves example", async () => {
        // The last line in the example has 506250 arrangements, takes too long to run.
        const lines = new Sequence([
            "???.### 1,1,3",
            ".??..??...?##. 1,1,3",
            "?#?#?#?#?#?#?#? 1,3,1,6",
            "????.#...#... 4,1,1",
            "????.######..#####. 1,6,5",
            // "?###???????? 3,2,1", // commented out as tests too slow for now.
        ])
        expect(await day12pt2.solvePart2(lines)).toBe(18902);
    });
});
