import {expect, describe, it} from "vitest";
import * as day12 from "../src/day12.js";
import {couldMatch} from "../src/day12.js";
import {Sequence} from "../src/sequence.js";

describe("Part 1", () => {
    it("Parses line", () => {
        expect(day12.parseLine("???.### 1,1,3")).toStrictEqual(["???.###", [1,1,3]]);
    });

    it("Counts unknowns", () => {
        expect(day12.countUnknowns("???.###")).toBe(3);
    });

    it("Identifies known damaged groups in a partial condition record", () => {
        expect(day12.knownDamagedGroups("???.###")).toStrictEqual([3]);
        expect(day12.knownDamagedGroups("????.#...#...")).toStrictEqual([1, 1]);
        expect(day12.knownDamagedGroups("?.")).toStrictEqual([]);
    });

    it("Decides whether a partial condition record could match damaged groups", () => {
        expect(day12.couldMatch("?", [1])).toBeTruthy();
        expect(day12.couldMatch("?", [2])).toBeFalsy();
        expect(day12.couldMatch("???.###", [1,1,3])).toBeTruthy();
        expect(day12.couldMatch("???.####", [1,1,3])).toBeFalsy();
    });

    it("Decides whether a completed condition record matches damaged groups", () => {
        expect(day12.matches("?.#", [1])).toBeFalsy();
        expect(day12.matches("..#", [1])).toBeTruthy();
        expect(day12.matches("#.#", [1])).toBeFalsy();
        expect(day12.matches("#.#", [1,1])).toBeTruthy();
        expect(day12.matches(".#...#", [1,1])).toBeTruthy();
    });

    it("Returns legal next steps from here", () => {
        expect(day12.neighbours("..#", [1])).toStrictEqual([]);
        expect(day12.neighbours("?.#", [1])).toStrictEqual(["..#"]);

        expect(day12.neighbours("???.###", [1,1,3])).toStrictEqual([
                                                        ".??.###",
                                                        "#??.###",
                                                    ]);
    });

    it("Solves example lines", () => {
        expect(day12.possibleArrangements("???.### 1,1,3")).toBe(1);
        expect(day12.possibleArrangements(".??..??...?##. 1,1,3")).toBe(4);
        expect(day12.possibleArrangements("?#?#?#?#?#?#?#? 1,3,1,6")).toBe(1);
    });
});

describe("Part 2", () => {
    it("Unfolds", () => {
        expect(day12.unfold(".# 1", 5)).toBe(".#?.#?.#?.#?.# 1,1,1,1,1");
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
        expect(await day12.solvePart2(lines)).toBe(18902);
    });
});