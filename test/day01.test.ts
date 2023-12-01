import {expect, describe, it} from "vitest";
import * as day01 from "../src/day01.js";
import {Sequence} from "../src/sequence.js";

describe("Part 1", () => {
    it("Finds calibration value from string", () => {
        expect(day01.calibrationValue("1abc2")).toBe(12);
        expect(day01.calibrationValue("treb7uchet")).toBe(77);
    });

    it("Sums calibration values from sequence of strings", async () => {
        const input = new Sequence([
            "1abc2",
            "pqr3stu8vwx",
            "a1b2c3d4e5f",
            "treb7uchet"
        ]);

        expect(await day01.sumCalibrationValues(input)).toBe(142);
    });
});