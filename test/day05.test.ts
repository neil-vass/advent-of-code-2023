import {expect, describe, it} from "vitest";
import {mapFnMultipleRanges, solvePart2} from "../src/day05.js";

// Worked example from https://adventofcode.com/2023/day/5
const exampleFilename = "./test/data/day05-example.txt";

describe("Part 2", () => {
    it("mapFnMultipleRanges matches example", () => {
        const seedRanges = [{min: 79, max: 92}, {min: 55, max: 67}];

        const mapRanges = [
            { min: 98, max: 99, convert: (n: number) => n + -48 },
            { min: 50, max: 97, convert: (n: number) => n + 2 }
        ];

        expect(mapFnMultipleRanges(seedRanges, mapRanges)).toStrictEqual(
            [{min: 81, max: 94}, {min: 57, max: 69}]);
    });

    it("solvePart2 matches example", async () => {
        expect(await solvePart2(exampleFilename)).toBe(46);
    });
});