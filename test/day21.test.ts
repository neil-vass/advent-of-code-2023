import {expect, describe, it, beforeEach} from "vitest";
import * as day21 from "../src/day21.js";
import {Sequence} from "../src/sequence.js";

let exampleLines: Sequence<string>;
beforeEach(() => {
    exampleLines = new Sequence([
        "...........",
        ".....###.#.",
        ".###.##..#.",
        "..#.#...#..",
        "....#.#....",
        ".##..S####.",
        ".##..#...#.",
        ".......##..",
        ".##.#.####.",
        ".##..##.##.",
        "...........",
    ])
});

describe("Part 1", () => {
    it("Moves one step", async () => {
        const garden = await day21.Garden.buildFromDescription(exampleLines);
        expect(garden.start).toStrictEqual({x:5, y:5});
        expect(garden.numPlotsReachable(1)).toBe(2);
    });

    it("Moves two steps", async () => {
        const garden = await day21.Garden.buildFromDescription(exampleLines);
        expect(garden.numPlotsReachable(2)).toBe(4);
    });

    it("Moves six steps", async () => {
        const garden = await day21.Garden.buildFromDescription(exampleLines);
        expect(garden.numPlotsReachable(6)).toBe(16);
    });
});