import {expect, describe, it} from "vitest";
import * as day14 from "../src/day14.js";
import {Sequence} from "../src/sequence.js";

describe("Part 1", () => {
    it("Calculates total load", async () => {
        const lines =  new Sequence([
            "O....#....",
            "O.OO#....#",
            ".....##...",
            "OO.#O....O",
            ".O.....O#.",
            "O.#..O.#.#",
            "..O..#O..O",
            ".......O..",
            "#....###..",
            "#OO..#....",
        ]);
        const panel = await day14.Panel.buildFromDescription(lines);
        expect(panel.totalLoad()).toBe(1*10 + 3*9 + 0*8 + 4*7 + 2*6 + 2*5 + 3*4 + 1*3 + 0*2 + 2*1);
    });

    it("Tilts", async () => {
        const lines =  new Sequence([
            "O....#....",
            "O.OO#....#",
            ".....##...",
            "OO.#O....O",
            ".O.....O#.",
            "O.#..O.#.#",
            "..O..#O..O",
            ".......O..",
            "#....###..",
            "#OO..#....",
        ]);
        const panel = await day14.Panel.buildFromDescription(lines);
        panel.tilt(day14.North);
        expect(panel.totalLoad()).toBe(136);
    });
});

describe("Part 2", () => {
    it("Cycles", async () => {
        const lines =  new Sequence([
            "O....#....",
            "O.OO#....#",
            ".....##...",
            "OO.#O....O",
            ".O.....O#.",
            "O.#..O.#.#",
            "..O..#O..O",
            ".......O..",
            "#....###..",
            "#OO..#....",
        ]);
        const panel = await day14.Panel.buildFromDescription(lines);
        panel.cycle();
        expect(panel.print()).toBe(
            ".....#....\n" +
            "....#...O#\n" +
            "...OO##...\n" +
            ".OO#......\n" +
            ".....OOO#.\n" +
            ".O#...O#.#\n" +
            "....O#....\n" +
            "......OOOO\n" +
            "#...O###..\n" +
            "#..OO#....\n"
        );
    });

    it("Looks for patterns", async () => {
        const lines =  new Sequence([
            "O....#....",
            "O.OO#....#",
            ".....##...",
            "OO.#O....O",
            ".O.....O#.",
            "O.#..O.#.#",
            "..O..#O..O",
            ".......O..",
            "#....###..",
            "#OO..#....",
        ]);
        expect(await day14.solvePart2(lines)).toBe(64);
    });
});