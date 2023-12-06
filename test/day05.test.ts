import {expect, describe, it} from "vitest";
import {linesFromFile} from "../src/helpers.js";
import {Almanac, findLowestLocationNumber, mapFn, mapFnMultipleRanges, parseAlmanac} from "../src/day05.js";
import {Sequence} from "../src/sequence.js";

// Worked example from https://adventofcode.com/2023/day/5
const exampleFilename = "./test/data/day05-example.txt";

describe("Part 1", () => {
    it("Builds almanac", () => {
        const builder = new Almanac.builder();
        builder.addSeeds([79, 14, 55, 13]);
        builder.addMap("seed-to-soil");
        builder.addRangeForMap(50, 98, 2);
        builder.addRangeForMap(52, 50, 48);
        const almanac = builder.complete();

        expect(almanac.runMappings()).toStrictEqual([[79,81], [14,14], [55,57], [13,13]]);
    });

    it("Builds almanac from lines", async () => {
        const lines = new Sequence([
            "seeds: 79 14 55 13",
            "",
            "seed-to-soil map:",
            "50 98 2",
            "52 50 48"
        ]);
        const almanac = await parseAlmanac(lines);
        expect(almanac.runMappings()).toStrictEqual([[79,81], [14,14], [55,57], [13,13]]);
    });

    it("Builds whole example almanac", async () => {
        const lines = linesFromFile(exampleFilename);
        const almanac = await parseAlmanac(lines);
        expect(almanac.runMappings()).toStrictEqual([[79,82], [14,43], [55,86], [13,35]]);
    });

    it("Finds lowest location number from example", async () => {
        expect(await findLowestLocationNumber(exampleFilename)).toBe(35);
    });
});

describe("Part 2", () => {
    it("mapFn returns original range when no match", () => {
        expect(mapFn({min: 10, max: 20})).toStrictEqual([{min: 10, max: 20}]);
    });

    it("mapFn returns mapped range when completely inside", () => {
        expect(mapFn({min: 30, max: 40})).toStrictEqual([{min: 130, max: 140}]);
    });

    it("mapFn returns mapped plus unmapped ranges when partially below", () => {
        expect(mapFn({min: 20, max: 40})).toStrictEqual(
            [{min: 20, max: 29}, {min: 130, max: 140}]);
    });

    it("mapFn returns mapped plus unmapped ranges when partially above", () => {
        expect(mapFn({min: 40, max: 60})).toStrictEqual(
            [{min: 140, max: 150}, {min: 51, max: 60}]);
    });

    it("mapFn returns mapped plus unmapped ranges when surrounds", () => {
        expect(mapFn({min: 10, max: 80})).toStrictEqual(
            [{min: 10, max: 29}, {min: 130, max: 150}, {min: 51, max: 80}]);
    });

    it("mapFnMultipleRanges behaves like example", () => {
        const seedRanges = [{min: 79, max: 92}, {min: 55, max: 67}];

        expect(mapFnMultipleRanges(seedRanges)).toStrictEqual(
            [{min: 81, max: 94}, {min: 57, max: 69}]);
    });
});