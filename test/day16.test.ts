import {expect, describe, it} from "vitest";
import * as day16 from "../src/day16.js";
import {Sequence} from "../src/sequence.js";
import {linesFromFile} from "../src/helpers.js";

describe("Part 1", () => {
    it("Builds contraption", () => {
        const lines = linesFromFile("./test/day16-example.txt")
        const contraption = day16.Contraption.buildFromDescription(lines);
    });
});