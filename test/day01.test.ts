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

describe("Part 2", () => {
    it("Finds calibration value from string", () => {
        expect(day01.calibrationValueWithLetters("two1nine")).toBe(29);
        expect(day01.calibrationValueWithLetters("eightwothree")).toBe(83);
        expect(day01.calibrationValueWithLetters("abcone2threexyz")).toBe(13);
        expect(day01.calibrationValueWithLetters("xtwone3four")).toBe(24);
        expect(day01.calibrationValueWithLetters("4nineeightseven2")).toBe(42);
        expect(day01.calibrationValueWithLetters("zoneight234")).toBe(14);
        expect(day01.calibrationValueWithLetters("7pqrstsixteen")).toBe(76);
    });

    it("Sums calibration values from sequence of strings", async () => {
        const input = new Sequence([
            "two1nine",
            "eightwothree",
            "abcone2threexyz",
            "xtwone3four",
            "4nineeightseven2",
            "zoneight234",
            "7pqrstsixteen"
        ]);

        expect(await day01.sumCalibrationValues(input, day01.calibrationValueWithLetters)).toBe(281);
    });
});