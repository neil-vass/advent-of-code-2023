import {expect, describe, it} from "vitest";
import * as day03 from "../src/day03.js";
import {Sequence} from "../src/sequence.js";

describe("Part 1", () => {
    it("Part number if adjacent to a symbol", async () => {
        const schematic = new Sequence([
            "467..114..",
            "...*......"]);

        expect(await day03.findPartNumbers(schematic)).toStrictEqual([467]);
    });

    it("One symbol can identify multiple part numbers", async () => {
        const schematic = new Sequence([
            "467..114..",
            "...*......",
            "..35..633."]);

        expect(await day03.findPartNumbers(schematic)).toStrictEqual([467, 35]);
    });

    it("If multiple digits in a number are adjacent to a symbol, part number only added once", async () => {
        const schematic = new Sequence([
            "..35..633.",
            "......#..."]);

        expect(await day03.findPartNumbers(schematic)).toStrictEqual([633]);
    });
});

describe("Part 2", () => {
    it("Finds gear ratios from example", async () => {
        const schematic = new Sequence([
            "467..114..",
            "...*......",
            "..35..633.",
            "......#...",
            "617*......",
            ".....+.58.",
            "..592.....",
            "......755.",
            "...$.*....",
            ".664.598.."]);

        expect(await day03.sumGearRatios(schematic)).toBe(467835);
    });
});