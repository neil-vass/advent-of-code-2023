import {expect, describe, it} from "vitest";
import * as day01 from "../src/day01.js";

const testFilename = "./test/data/day01.txt"

describe("#fn", () => {
    it("runs", () => {
        expect(day01.fn(testFilename)).toBe("a real test");
    });
});