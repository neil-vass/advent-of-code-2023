import {expect, describe, it} from "vitest";
import * as day13 from "../src/day13.js";
import {Sequence} from "../src/sequence.js";
import {reflectionValue} from "../src/day13.js";

describe("Part 1", () => {
    it("Rotates", () => {
        const pattern = [
            "abc",
            "def"
        ];
        expect(day13.rotate(pattern)).toStrictEqual([
            "ad",
            "be",
            "cf"
        ])
    });

    it("Finds column of reflection", async () => {
        const lines = new Sequence([
            "#.##..##.",
            "..#.##.#.",
            "##......#",
            "##......#",
            "..#.##.#.",
            "..##..##.",
            "#.#.##.#.",
        ])
        expect(await day13.reflectionValue(lines)).toBe(5);
    });

    it("Finds row of reflection", async () => {
        const lines = new Sequence([
            "#...##..#",
            "#....#..#",
            "..##..###",
            "#####.##.",
            "#####.##.",
            "..##..###",
            "#....#..#",
        ])
        expect(await day13.reflectionValue(lines)).toBe(100 * 4);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "#.##..##.",
            "..#.##.#.",
            "##......#",
            "##......#",
            "..#.##.#.",
            "..##..##.",
            "#.#.##.#.",
            "",
            "#...##..#",
            "#....#..#",
            "..##..###",
            "#####.##.",
            "#####.##.",
            "..##..###",
            "#....#..#",
        ])
        expect(await day13.reflectionValue(lines)).toBe(405);
    });
});

describe("Part 2", () => {
    it("Ignores previously-found upper reflection row", async () => {
        const lines = new Sequence([
            "...#..#",
            "...#..#",// <- original mirror here
            "##..##.",
            ".#.##.#",
            "..#..##",
            "#.#.##.",
            "#.#.###",
            "##.##..",
            "##.##..",
            "#.#.###",
            "..#.##.", // <- replace first char here
            "..#..##",
            ".#.##.#",
            "##..##.",
            "...#..#",
        ]);

        expect(await day13.solvePart2(lines)).toBe(800);
    });

    it("Solves example", async () => {
        const lines = new Sequence([
            "#.##..##.",
            "..#.##.#.",
            "##......#",
            "##......#",
            "..#.##.#.",
            "..##..##.",
            "#.#.##.#.",
            "",
            "#...##..#",
            "#....#..#",
            "..##..###",
            "#####.##.",
            "#####.##.",
            "..##..###",
            "#....#..#",
        ])
        expect(await day13.solvePart2(lines)).toBe(400);
    });
});