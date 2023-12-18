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

describe("Examples from part 1", () => {
    it("Solves example lines (without unfolding)", () => {
        expect(day12pt2.possibleArrangements("???.###", [1,1,3])).toBe(1);
        expect(day12pt2.possibleArrangements(".??..??...?##.", [1,1,3])).toBe(4);
        expect(day12pt2.possibleArrangements("?#?#?#?#?#?#?#?.", [1,3,1,6])).toBe(1);
        expect(day12pt2.possibleArrangements("????.#...#...", [4,1,1])).toBe(1);
        expect(day12pt2.possibleArrangements("????.######..#####.", [1,6,5])).toBe(4);
        expect(day12pt2.possibleArrangements("?###????????", [3,2,1])).toBe(10);
    });
});

describe("Overall part 2 puzzle", () => {
    it("Unfolds", () => {
        expect(day12pt2.unfold(".# 1", 5)).toBe(".#?.#?.#?.#?.# 1,1,1,1,1");
    });

    it("Unfolds and solves slowest example line", () => {
        const unfoldedLine = day12pt2.unfold("?###???????? 3,2,1", 5);
        const [condition, damaged] = day12pt2.parseLine(unfoldedLine);
        expect(day12pt2.possibleArrangements(condition, damaged)).toBe(506250);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "???.### 1,1,3",
            ".??..??...?##. 1,1,3",
            "?#?#?#?#?#?#?#? 1,3,1,6",
            "????.#...#... 4,1,1",
            "????.######..#####. 1,6,5",
            "?###???????? 3,2,1",
        ])
        expect(await day12pt2.solvePart2(lines)).toBe(525152);
    });
});
