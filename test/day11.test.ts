import {expect, describe, it, beforeEach} from "vitest";
import * as day11 from "../src/day11.js";
import {Sequence} from "../src/sequence.js";

// Same map from the example for each test.
let lines: Sequence<string>;
beforeEach(() => {
    lines = new Sequence([
        "...#......",
        ".......#..",
        "#.........",
        "..........",
        "......#...",
        ".#........",
        ".........#",
        "..........",
        ".......#..",
        "#...#.....",
    ]);
});

describe("Part 1", () => {
    it("Counts numEntriesSmallerThan", () => {
        expect(day11.numEntriesSmallerThan(10, [1, 3, 4, 10, 12])).toBe(3);
        expect(day11.numEntriesSmallerThan(8, [0,1,2])).toBe(3);
        expect(day11.numEntriesSmallerThan(3, [5,6])).toBe(0);
    });

    it("Finds galaxy positions", async () => {
        const starMap = await day11.StarMap.buildFromDescription(lines);
        expect(starMap.galaxies.size).toBe(9);

        // Map has expanded
        expect(starMap.galaxies.get(1)).toStrictEqual({x:0, y:4});
        expect(starMap.galaxies.get(2)).toStrictEqual({x:1, y:9});

        expect(starMap.emptyRows).toStrictEqual(new Set([3, 7]));
        expect(starMap.emptyCols).toStrictEqual(new Set([2, 5, 8]));
    });

    it("Finds shortest paths", async () => {
        const starMap = await day11.StarMap.buildFromDescription(lines);
        expect(starMap.shortestPathLength(5, 9)).toBe(9);
        expect(starMap.shortestPathLength(1, 7)).toBe(15);
        expect(starMap.shortestPathLength(3, 6)).toBe(17);
        expect(starMap.shortestPathLength(8, 9)).toBe(5);
    });

    it("Solves example", async () => {
        expect(await day11.solvePart1(lines)).toBe(374);
    });
});


describe("Part 2", () => {
    it("Solves example", async () => {
        expect(await day11.solvePart2(lines, 10)).toBe(1030);
    });
});