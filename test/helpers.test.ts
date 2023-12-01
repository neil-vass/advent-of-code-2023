import {expect, describe, it} from "vitest";
import {singleLineFromFile, linesFromFile} from "../src/helpers.js";

describe("#singleLineFromFile", () => {
    it("Fetches the single line from a one-line file, dropping newline at the end.", () => {
        const line = singleLineFromFile("./test/data/single-line-file.txt");
        expect(line).toBe("word");
    });
});

describe("#linesFromFile", () => {
    it("Returns all lines", async () => {
        const lineReader = linesFromFile("./test/data/example-file.txt");
        const results = await lineReader.toArray();

        expect(results.length).toBe(3);
        expect(results[2]).toBe("And here's line 3");
    });

    it("Throws if file is missing", async () => {
        const lineReader = linesFromFile("./test/data/not-a-file.txt");
        expect(async () => { for await (const line of lineReader) {} })
            .rejects
            .toThrow("no such file or directory");
    });
});