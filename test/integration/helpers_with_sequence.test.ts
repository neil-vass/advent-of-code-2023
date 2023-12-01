import {expect, describe, it} from "vitest";
import {linesFromFile} from "../../src/helpers";
import {Sequence} from "../../src/sequence";

describe("#map with #linesFromFile", () => {
    it("Maps over lines from a file", async () => {
        const lines = linesFromFile("./test/data/example-file.txt");
        const justNums = lines.map(ln => Number(ln.match(/\d+/)));

        const results = await justNums.toArray();
        expect(results).toStrictEqual([1, 2, 3]);
    });
});

describe("#sum with #map and #linesFromFile", () => {
    it("Sums values taken from file and manipulated", async () => {
        const lines = linesFromFile("./test/data/example-file.txt");
        const nums = lines.map(ln => Number(ln.match(/\d+/)));
        const doubledNums = nums.map(n => n*2);

        // So far: nothing's been pulled from the file, nothing's been processed.
        const total = await Sequence.sum(doubledNums);
        expect(total).toBe(12);
    });
});