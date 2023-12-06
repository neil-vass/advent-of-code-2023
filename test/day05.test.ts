import {expect, describe, it} from "vitest";
import {linesFromFile} from "../src/helpers.js";
import {Almanac, findLowestLocationNumber, parseAlmanac} from "../src/day05.js";
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
    it("Matches example", () => {
        // TODO
    });
});