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
    it("Moves 1 step", async () => {
        const garden = await day21.Garden.buildFromDescription(exampleLines);
        expect(garden.start).toStrictEqual({x:5, y:5});
        expect(garden.numPlotsReachable(1)).toBe(2);
    });

    it("Moves 2 steps", async () => {
        const garden = await day21.Garden.buildFromDescription(exampleLines);
        expect(garden.numPlotsReachable(2)).toBe(4);
    });

    it("Moves 6 steps", async () => {
        const garden = await day21.Garden.buildFromDescription(exampleLines);
        expect(garden.numPlotsReachable(6)).toBe(16);
    });
});

describe("Part 2: infinite bounds", () => {
    it("Moves 6 steps in infinite garden", async () => {
        const garden = await day21.Garden.withInfiniteBounds(exampleLines);
        expect(garden.numPlotsReachable(6)).toBe(16);
    });

    it("Moves 10 steps in infinite garden", async () => {
        const garden = await day21.Garden.withInfiniteBounds(exampleLines);
        expect(garden.numPlotsReachable(10)).toBe(50);
    });

    it("Moves 50 steps in infinite garden", async () => {
        const garden = await day21.Garden.withInfiniteBounds(exampleLines);
        expect(garden.numPlotsReachable(50)).toBe(1594);
    });

    it("Moves 100 steps in infinite garden", async () => {
        const garden = await day21.Garden.withInfiniteBounds(exampleLines);
        expect(garden.numPlotsReachable(100)).toBe(6536);
    });

    it("Moves 500 steps in infinite garden", async () => {
        const garden = await day21.Garden.withInfiniteBounds(exampleLines);
        expect(garden.numPlotsReachable(500)).toBe(167004);
    });
});